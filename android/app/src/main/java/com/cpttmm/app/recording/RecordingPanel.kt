package com.cpttmm.app.recording

import android.Manifest
import android.app.Dialog
import android.content.Context
import android.content.pm.PackageManager
import android.content.res.ColorStateList
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.Paint
import android.graphics.drawable.GradientDrawable
import android.graphics.drawable.RippleDrawable
import android.media.AudioAttributes
import android.media.AudioFocusRequest
import android.media.AudioRecordingConfiguration
import android.media.AudioManager
import android.media.MediaPlayer
import android.media.MediaRecorder
import android.os.Build
import android.os.Handler
import android.os.Looper
import android.os.SystemClock
import android.view.Gravity
import android.view.MotionEvent
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.ImageButton
import android.widget.ImageView
import android.widget.LinearLayout
import android.widget.TextView
import com.cpttmm.app.MainActivity
import com.cpttmm.app.R
import com.cpttmm.app.ui.defaultNativeThemePalette
import androidx.compose.ui.graphics.toArgb
import androidx.core.graphics.ColorUtils
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.cancel
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import org.json.JSONObject
import java.io.File
import java.util.UUID

// One panel belongs to one WebView (account + tab). A document/navigation change destroys it.
class RecordingPanel(
    private val context: Context,
    private val binggan: String,
    private val api: RecordingApi,
    private val stopWebAudio: () -> Unit,
    private val themeName: () -> String = { "green" },
) {
    private val scope = CoroutineScope(SupervisorJob() + Dispatchers.Main.immediate)
    private val handler = Handler(Looper.getMainLooper())
    private val directory = File(context.cacheDir, "recordings/${UUID.randomUUID()}").apply { mkdirs() }
    private var dialog: Dialog? = null
    private var request: JSONObject? = null
    private var reply: ((String) -> Unit)? = null
    private var confirmed: JSONObject? = null
    private var confirmedFile: File? = null
    private var confirmedWaves: List<Int> = emptyList()
    private var candidate: File? = null
    private var checked: File? = null
    private var durationMs = 0
    private var uploadTicket: JSONObject? = null
    private var ticketCreated = 0L
    private var maxDurationMs = 0
    private var maxSizeBytes = 0L
    private var recorder: MediaRecorder? = null
    private var player: MediaPlayer? = null
    private var job: Job? = null
    private var generation = 0
    private var startedAt = 0L
    private var suspended = false
    private var destroyed = false
    private var busy = false
    private var status: TextView? = null
    private var recordButton: ImageButton? = null
    private var confirmButton: ImageButton? = null
    private var playButton: ImageButton? = null
    private var wave: Waveform? = null
    private var primaryColor = Color.rgb(82, 176, 81)
    private var onPrimaryColor = Color.WHITE
    private val amplitudes = mutableListOf<Int>()
    private val captureChanges = object : AudioManager.AudioRecordingCallback() {
        override fun onRecordingConfigChanged(configs: MutableList<AudioRecordingConfiguration>) {
            if (recorder?.activeRecordingConfiguration?.isClientSilenced == true) stopRecording()
        }
    }
    private val audioManager = context.getSystemService(AudioManager::class.java)
    private val focus = AudioFocusRequest.Builder(AudioManager.AUDIOFOCUS_GAIN_TRANSIENT)
        .setAudioAttributes(AudioAttributes.Builder().setUsage(AudioAttributes.USAGE_MEDIA).build())
        .setOnAudioFocusChangeListener { change ->
            if (change < 0) { stopRecording(); stopPlayback() }
        }.build()

    fun open(payload: JSONObject, respond: (String) -> Unit) {
        if (destroyed || suspended || payload.optString("binggan") != binggan ||
            payload.optString("requestId").isBlank() || payload.optString("editorId").isBlank() ||
            payload.optLong("threadId") < 1) return
        if (request != null) finish("cancelled")
        if (requestEditor != payload.optString("editorId")) clearConfirmed()
        requestEditor = payload.optString("editorId")
        request = payload
        reply = respond
        discardCandidate()
        maxDurationMs = 0
        stopWebAudio()
        showDialog()
        val current = ++generation
        busy = true
        updateControls()
        job = scope.launch {
            runCatching {
                api.request("config").also { check(it.getBoolean("enabled")) { "录音暂不可用" } }
            }.onSuccess { config ->
                if (generation != current) return@onSuccess
                maxDurationMs = config.getInt("max_duration_ms")
                maxSizeBytes = config.getLong("max_size_bytes")
                status?.text = if (confirmed != null) {
                    context.getString(R.string.recording_confirmed, confirmed!!.getInt("duration_ms") / 1000.0)
                } else {
                    context.getString(R.string.recording_limit, maxDurationMs / 1000.0)
                }
            }.onFailure { if (generation == current) status?.text = it.message ?: "录音暂不可用" }
            if (generation == current) { busy = false; updateControls() }
        }
    }
    private var requestEditor: String? = null

    fun release(editorId: String) {
        if (editorId != requestEditor) return
        cancelRequest()
        clearConfirmed()
        requestEditor = null
    }

    fun pause() {
        suspended = true
        stopRecording()
        stopPlayback()
        dialog?.hide()
    }

    fun resume() {
        suspended = false
        if (request != null) dialog?.show()
    }

    fun destroy() {
        destroyed = true
        cancelRequest()
        scope.cancel()
        clearConfirmed()
        directory.deleteRecursively()
    }

    private fun showDialog() {
        val palette = defaultNativeThemePalette(themeName())
        primaryColor = palette.primaryColor.toArgb()
        onPrimaryColor = if (ColorUtils.calculateLuminance(primaryColor) > 0.5) Color.rgb(53, 28, 24) else Color.WHITE
        val surface = palette.backgroundColor.toArgb()
        val foreground = if (ColorUtils.calculateLuminance(surface) > 0.5) Color.rgb(51, 54, 57) else Color.rgb(242, 242, 245)
        val layout = LinearLayout(context).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(dp(20), dp(12), dp(20), dp(20))
            background = GradientDrawable().apply {
                setColor(surface)
                cornerRadii = floatArrayOf(dp(28).toFloat(), dp(28).toFloat(), dp(28).toFloat(), dp(28).toFloat(), 0f, 0f, 0f, 0f)
            }
        }
        layout.addView(View(context).apply {
            background = GradientDrawable().apply {
                setColor(ColorUtils.setAlphaComponent(foreground, 64))
                cornerRadius = dp(2).toFloat()
            }
        }, LinearLayout.LayoutParams(dp(32), dp(4)).apply { gravity = Gravity.CENTER_HORIZONTAL; bottomMargin = dp(20) })
        val recordingCard = LinearLayout(context).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(dp(16), dp(8), dp(16), dp(16))
            background = GradientDrawable().apply {
                setColor(ColorUtils.blendARGB(surface, primaryColor, 0.08f))
                cornerRadius = dp(16).toFloat()
                setStroke(dp(1).coerceAtLeast(1), ColorUtils.setAlphaComponent(primaryColor, 89))
            }
        }
        layout.addView(recordingCard)
        val cardHeader = LinearLayout(context).apply { gravity = Gravity.CENTER_VERTICAL }
        recordingCard.addView(cardHeader)
        status = TextView(context).apply {
            text = "正在读取录音配置…"
            textSize = 15f
            setTextColor(foreground)
        }
        cardHeader.addView(status, LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1f))
        cardHeader.addView(Button(context).apply {
            text = "关闭"
            textSize = 14f
            isAllCaps = false
            minWidth = 0
            minHeight = 0
            setTextColor(primaryColor)
            val mask = GradientDrawable().apply { setColor(Color.WHITE); cornerRadius = dp(20).toFloat() }
            background = RippleDrawable(ColorStateList.valueOf(ColorUtils.setAlphaComponent(primaryColor, 32)), null, mask)
            setOnClickListener { finish("cancelled") }
        }, LinearLayout.LayoutParams(dp(64), dp(48)))
        wave = Waveform(context, primaryColor)
        recordingCard.addView(wave, LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, dp(72)))
        layout.addView(TextView(context).apply {
            text = "长按麦克风录音，松手停止"
            textSize = 14f
            gravity = Gravity.CENTER
            setTextColor(foreground)
            setPadding(0, dp(16), 0, dp(16))
        })
        val controls = LinearLayout(context).apply {
            orientation = LinearLayout.HORIZONTAL
            gravity = Gravity.CENTER
        }
        layout.addView(controls)
        playButton = iconButton("试听录音", R.drawable.recording_play).apply { setOnClickListener { play() } }
        controls.addView(playButton)
        recordButton = iconButton("长按录音，松手停止", R.drawable.recording_mic, 60, emphasized = true).apply {
            setOnTouchListener { view, event ->
                when (event.actionMasked) {
                    MotionEvent.ACTION_DOWN -> { startRecording(); true }
                    MotionEvent.ACTION_UP -> { stopRecording(); view.performClick(); true }
                    MotionEvent.ACTION_CANCEL -> { stopRecording(); true }
                    else -> true
                }
            }
        }
        controls.addView(recordButton)
        confirmButton = iconButton("确认并上传", R.drawable.recording_check).apply {
            setOnClickListener {
                if (!busy && recorder == null) {
                    if (candidate == null && confirmed != null) {
                        clearConfirmed()
                        finish("removed")
                    } else {
                        confirm()
                    }
                }
            }
        }
        controls.addView(confirmButton)
        dialog = Dialog(context).apply {
            setContentView(layout)
            setOnCancelListener { finish("cancelled") }
            show()
            window?.apply {
                setBackgroundDrawableResource(android.R.color.transparent)
                decorView.setPadding(0, 0, 0, 0)
                setLayout(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT)
                setGravity(Gravity.BOTTOM)
            }
        }
        wave?.values = confirmedWaves
    }

    private fun dp(value: Int): Int = (value * context.resources.displayMetrics.density).toInt()

    private fun iconButton(label: String, icon: Int, size: Int = 50, emphasized: Boolean = false): ImageButton = ImageButton(context).apply {
        contentDescription = label
        tooltipText = label
        setImageResource(icon)
        scaleType = ImageView.ScaleType.FIT_CENTER
        val padding = if (emphasized) dp(14) else 0
        setPadding(padding, padding, padding, padding)
        val color = if (emphasized) onPrimaryColor else primaryColor
        imageTintList = ColorStateList(arrayOf(intArrayOf(-android.R.attr.state_enabled), intArrayOf()), intArrayOf(ColorUtils.setAlphaComponent(color, 96), color))
        val fill = GradientDrawable().apply {
            shape = GradientDrawable.OVAL
            setColor(if (emphasized) primaryColor else Color.TRANSPARENT)
        }
        val mask = GradientDrawable().apply { shape = GradientDrawable.OVAL; setColor(Color.WHITE) }
        background = RippleDrawable(ColorStateList.valueOf(ColorUtils.setAlphaComponent(color, 32)), fill, mask)
        layoutParams = LinearLayout.LayoutParams(dp(size), dp(size)).apply { setMargins(dp(16), 0, dp(16), 0) }
    }

    private fun updateControls() {
        recordButton?.isEnabled = !busy && maxDurationMs > 0
        val canRemove = confirmed != null && candidate == null
        confirmButton?.isEnabled = !busy && recorder == null && (checked != null || canRemove)
        confirmButton?.setImageResource(if (canRemove) R.drawable.recording_close else R.drawable.recording_check)
        confirmButton?.contentDescription = if (canRemove) "移除录音" else "确认并上传"
        confirmButton?.tooltipText = confirmButton?.contentDescription
        playButton?.isEnabled = !busy && recorder == null && (checked != null || confirmedFile != null)
        playButton?.setImageResource(if (player == null) R.drawable.recording_play else R.drawable.recording_stop)
        playButton?.contentDescription = if (player == null) "试听录音" else "停止试听"
        playButton?.tooltipText = playButton?.contentDescription
        recordButton?.setImageResource(if (recorder == null) R.drawable.recording_mic else R.drawable.recording_stop)
    }

    private fun startRecording() {
        if (busy || suspended || recorder != null || maxDurationMs <= 0) return
        if (context.checkSelfPermission(Manifest.permission.RECORD_AUDIO) != PackageManager.PERMISSION_GRANTED) {
            (context as? MainActivity)?.requestRecordingPermission { granted ->
                status?.text = if (granted) "权限已允许，请再次长按录音" else "需要麦克风权限才能录音"
            }
            return
        }
        stopPlayback()
        if (audioManager.requestAudioFocus(focus) != AudioManager.AUDIOFOCUS_REQUEST_GRANTED) {
            status?.text = "麦克风正在被占用，请重试"
            return
        }
        discardCandidate()
        amplitudes.clear()
        candidate = File(directory, "${UUID.randomUUID()}.m4a")
        try {
            @Suppress("DEPRECATION")
            val next = if (Build.VERSION.SDK_INT >= 31) MediaRecorder(context) else MediaRecorder()
            recorder = next
            next.setAudioSource(MediaRecorder.AudioSource.MIC)
            next.setOutputFormat(MediaRecorder.OutputFormat.MPEG_4)
            next.setAudioEncoder(MediaRecorder.AudioEncoder.AAC)
            next.setAudioChannels(1)
            next.setAudioSamplingRate(RecordingAudio.SAMPLE_RATE)
            next.setAudioEncodingBitRate(RecordingAudio.BIT_RATE)
            next.setOutputFile(candidate!!.absolutePath)
            next.setMaxDuration(maxDurationMs)
            next.setOnInfoListener { _, what, _ ->
                if (what == MediaRecorder.MEDIA_RECORDER_INFO_MAX_DURATION_REACHED) stopRecording()
            }
            next.setOnErrorListener { _, _, _ -> stopRecording() }
            next.registerAudioRecordingCallback(context.mainExecutor, captureChanges)
            next.prepare()
            next.start()
            startedAt = SystemClock.elapsedRealtime()
            handler.post(sampleAmplitude)
            handler.postDelayed(autoStop, maxDurationMs.toLong())
            updateControls()
        } catch (_: Exception) {
            recorder?.unregisterAudioRecordingCallback(captureChanges)
            recorder?.release()
            recorder = null
            discardCandidate()
            audioManager.abandonAudioFocusRequest(focus)
            status?.text = "录音失败，请重录"
        }
    }
    private val autoStop = Runnable { stopRecording() }
    private val sampleAmplitude = object : Runnable {
        override fun run() {
            val active = recorder ?: return
            amplitudes += runCatching { active.maxAmplitude }.getOrDefault(0)
            wave?.values = amplitudes.toList()
            status?.text = context.getString(R.string.recording_in_progress, (SystemClock.elapsedRealtime() - startedAt) / 1000.0)
            handler.postDelayed(this, 100)
        }
    }

    private fun stopRecording(prepare: Boolean = true) {
        val active = recorder ?: return
        recorder = null
        handler.removeCallbacks(sampleAmplitude)
        handler.removeCallbacks(autoStop)
        val stopped = runCatching { active.stop() }.isSuccess
        active.unregisterAudioRecordingCallback(captureChanges)
        active.release()
        audioManager.abandonAudioFocusRequest(focus)
        if (!prepare || !stopped) {
            discardCandidate()
            status?.text = "录音太短或编码失败，请重录"
            updateControls()
            return
        }
        busy = true
        updateControls()
        val source = candidate ?: return
        val current = generation
        job = scope.launch {
            runCatching { withContext(Dispatchers.IO) { RecordingAudio.prepare(source, maxDurationMs) } }
                .onSuccess { (file, duration) ->
                    if (current != generation) { file.delete(); return@onSuccess }
                    checked = file
                    durationMs = duration
                    status?.text = context.getString(R.string.recording_ready, duration / 1000.0)
                }.onFailure {
                    if (current == generation) {
                        discardCandidate()
                        status?.text = "编码失败，请重录；原附件已保留"
                    }
                }
            if (current == generation) { busy = false; updateControls() }
        }
    }

    private fun play() {
        if (player != null) { stopPlayback(); return }
        val file = checked ?: confirmedFile ?: return
        stopWebAudio()
        if (audioManager.requestAudioFocus(focus) != AudioManager.AUDIOFOCUS_REQUEST_GRANTED) return
        try {
            player = MediaPlayer().apply {
                setAudioAttributes(AudioAttributes.Builder().setUsage(AudioAttributes.USAGE_MEDIA).build())
                setDataSource(file.absolutePath)
                setOnCompletionListener { stopPlayback() }
                setOnErrorListener { _, _, _ -> stopPlayback(); status?.text = "试听失败，请重录"; true }
                prepare()
                start()
            }
            updateControls()
        } catch (_: Exception) {
            stopPlayback()
            status?.text = "试听失败，请重录"
        }
    }

    private fun stopPlayback() {
        player?.release()
        player = null
        audioManager.abandonAudioFocusRequest(focus)
        updateControls()
    }

    private fun confirm() {
        if (busy || recorder != null) return
        val file = checked
        if (file == null) {
            if (confirmed != null) finish("confirmed", confirmed)
            return
        }
        stopPlayback()
        val payload = request ?: return
        val current = generation
        busy = true
        updateControls()
        status?.text = "正在上传…"
        job = scope.launch {
            runCatching {
                require(file.length() in 1..maxSizeBytes) { "录音大小异常，请重录" }
                var ticket = uploadTicket
                // Completion retries use the same object; a fresh URL is needed only before an unconfirmed upload expires.
                if (ticket != null) {
                    val completed = runCatching { api.request("${ticket.getLong("recording_id")}/complete", JSONObject()) }.getOrNull()
                    if (completed != null) {
                        require(!completed.getBoolean("expired")) { "录音已失效，请重录" }
                        return@runCatching completed
                    }
                }
                if (ticket == null || SystemClock.elapsedRealtime() - ticketCreated >= 290000) {
                    ticket = api.request("uploads", JSONObject()
                        .put("thread_id", payload.getLong("threadId"))
                        .put("size_bytes", file.length())
                        .put("duration_ms", durationMs)
                        .put("content_md5", withContext(Dispatchers.IO) { RecordingApi.md5(file) }))
                    uploadTicket = ticket
                    ticketCreated = SystemClock.elapsedRealtime()
                }
                api.upload(file, ticket.getJSONObject("upload"))
                api.request("${ticket.getLong("recording_id")}/complete", JSONObject()).also {
                    require(!it.getBoolean("expired")) { "录音已失效，请重录" }
                }
            }.onSuccess { result ->
                if (current != generation || destroyed) return@onSuccess
                confirmedFile?.delete()
                confirmedFile = file
                confirmed = result
                confirmedWaves = amplitudes.toList()
                checked = null
                candidate?.delete()
                candidate = null
                busy = false
                finish("confirmed", result)
            }.onFailure {
                if (current == generation) status?.text = it.message ?: "上传失败，片段已保留，请重试"
            }
            if (current == generation) { busy = false; updateControls() }
        }
    }

    private fun finish(action: String, recording: JSONObject? = null) {
        val payload = request ?: return
        val respond = reply
        cancelRequest()
        respond?.invoke(JSONObject().put("type", "recordingResult").put("payload", JSONObject()
            .put("requestId", payload.optString("requestId"))
            .put("editorId", payload.optString("editorId"))
            .put("threadId", payload.optLong("threadId"))
            .put("binggan", binggan)
            .put("action", action)
            .put("recording", recording ?: JSONObject.NULL)).toString())
    }

    private fun cancelRequest() {
        generation++
        job?.cancel()
        job = null
        stopRecording(prepare = false)
        stopPlayback()
        dialog?.setOnCancelListener(null)
        dialog?.dismiss()
        dialog = null
        request = null
        reply = null
        busy = false
        discardCandidate()
    }

    private fun discardCandidate() {
        candidate?.delete()
        checked?.delete()
        candidate = null
        checked = null
        uploadTicket = null
        durationMs = 0
    }

    private fun clearConfirmed() {
        confirmed = null
        confirmedFile?.delete()
        confirmedFile = null
        confirmedWaves = emptyList()
    }
}

private class Waveform(context: Context, color: Int) : View(context) {
    var values: List<Int> = emptyList()
        set(value) { field = value; invalidate() }
    private val paint = Paint(Paint.ANTI_ALIAS_FLAG).apply { this.color = color; strokeWidth = 4f }
    override fun onDraw(canvas: Canvas) {
        super.onDraw(canvas)
        val samples = values.takeLast(150)
        if (samples.isEmpty()) return
        samples.forEachIndexed { index, amplitude ->
            val x = (index + 0.5f) * width / samples.size
            val size = (amplitude / 32767f * height * 0.45f).coerceAtLeast(2f)
            canvas.drawLine(x, height / 2f - size, x, height / 2f + size, paint)
        }
    }
}
