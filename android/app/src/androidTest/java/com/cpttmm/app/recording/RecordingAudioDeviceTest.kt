package com.cpttmm.app.recording

import android.media.MediaCodec
import android.media.MediaCodecInfo
import android.media.MediaExtractor
import android.media.MediaFormat
import android.media.MediaMuxer
import androidx.test.core.app.ApplicationProvider
import androidx.test.ext.junit.runners.AndroidJUnit4
import android.content.Context
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test
import org.junit.runner.RunWith
import java.io.File

@RunWith(AndroidJUnit4::class)
class RecordingAudioDeviceTest {
    @Test fun validatesAacLcAndRemuxesOnlyWholeFramesWithinTheConfiguredLimit() {
        val context = ApplicationProvider.getApplicationContext<Context>()
        val file = File.createTempFile("recording-codec-", ".m4a", context.cacheDir)
        val format = MediaFormat.createAudioFormat("audio/mp4a-latm", RecordingAudio.SAMPLE_RATE, 1).apply {
            setInteger(MediaFormat.KEY_AAC_PROFILE, MediaCodecInfo.CodecProfileLevel.AACObjectLC)
            setInteger(MediaFormat.KEY_BIT_RATE, RecordingAudio.BIT_RATE)
            setInteger(MediaFormat.KEY_MAX_INPUT_SIZE, 4096)
        }
        val encoder = MediaCodec.createEncoderByType("audio/mp4a-latm")
        val muxer = MediaMuxer(file.absolutePath, MediaMuxer.OutputFormat.MUXER_OUTPUT_MPEG_4)
        var output: File? = null
        try {
            encoder.configure(format, null, null, MediaCodec.CONFIGURE_FLAG_ENCODE)
            encoder.start()
            var inputFrames = 0
            var sentEnd = false
            var ended = false
            var track = -1
            val info = MediaCodec.BufferInfo()
            while (!ended) {
                if (!sentEnd) {
                    val index = encoder.dequeueInputBuffer(10000)
                    if (index >= 0) {
                        val bytes = encoder.getInputBuffer(index)!!
                        val samples = 1024
                        if (inputFrames < 100) {
                            bytes.clear()
                            bytes.put(ByteArray(samples * 2))
                            encoder.queueInputBuffer(index, 0, samples * 2, inputFrames * samples * 1_000_000L / RecordingAudio.SAMPLE_RATE, 0)
                            inputFrames++
                        } else {
                            encoder.queueInputBuffer(index, 0, 0, inputFrames * samples * 1_000_000L / RecordingAudio.SAMPLE_RATE, MediaCodec.BUFFER_FLAG_END_OF_STREAM)
                            sentEnd = true
                        }
                    }
                }
                val index = encoder.dequeueOutputBuffer(info, 10000)
                if (index == MediaCodec.INFO_OUTPUT_FORMAT_CHANGED) {
                    track = muxer.addTrack(encoder.outputFormat)
                    muxer.start()
                } else if (index >= 0) {
                    if (info.size > 0 && info.flags and MediaCodec.BUFFER_FLAG_CODEC_CONFIG == 0) {
                        muxer.writeSampleData(track, encoder.getOutputBuffer(index)!!, info)
                    }
                    ended = info.flags and MediaCodec.BUFFER_FLAG_END_OF_STREAM != 0
                    encoder.releaseOutputBuffer(index, false)
                }
            }
            muxer.stop()
            val (checked, duration) = RecordingAudio.prepare(file, 1000)
            output = checked
            assertTrue(duration in 950..1000)
            val extractor = MediaExtractor()
            try {
                extractor.setDataSource(checked.absolutePath)
                val actual = extractor.getTrackFormat(0)
                assertEquals("audio/mp4a-latm", actual.getString(MediaFormat.KEY_MIME))
                assertEquals(RecordingAudio.SAMPLE_RATE, actual.getInteger(MediaFormat.KEY_SAMPLE_RATE))
                assertEquals(1, actual.getInteger(MediaFormat.KEY_CHANNEL_COUNT))
                assertTrue(actual.getLong(MediaFormat.KEY_DURATION) <= 1_000_000)
            } finally { extractor.release() }
        } finally {
            encoder.release()
            muxer.release()
            output?.delete()
            file.delete()
        }
    }
}
