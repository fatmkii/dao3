package com.cpttmm.app.recording

import android.media.MediaCodec
import android.media.MediaExtractor
import android.media.MediaFormat
import android.media.MediaMuxer
import java.io.File
import java.nio.ByteBuffer
import kotlin.math.ceil

object RecordingAudio {
    const val SAMPLE_RATE = 44100
    const val BIT_RATE = 128000
    private const val FRAME_SAMPLES = 1024

    fun frameFits(timeUs: Long, maxDurationMs: Int): Boolean =
        timeUs >= 0 && timeUs + ceil(FRAME_SAMPLES * 1_000_000.0 / SAMPLE_RATE).toLong() <= maxDurationMs * 1000L

    // Always remux complete AAC frames; this also removes any encoder tail beyond the configured limit.
    fun prepare(source: File, maxDurationMs: Int): Pair<File, Int> {
        val extractor = MediaExtractor()
        val output = File(source.parentFile, "${source.nameWithoutExtension}-checked.m4a")
        var muxer: MediaMuxer? = null
        try {
            extractor.setDataSource(source.absolutePath)
            require(extractor.trackCount == 1) { "录音格式错误，请重录" }
            val format = extractor.getTrackFormat(0)
            require(format.getString(MediaFormat.KEY_MIME) == "audio/mp4a-latm" &&
                format.getInteger(MediaFormat.KEY_SAMPLE_RATE) == SAMPLE_RATE &&
                format.getInteger(MediaFormat.KEY_CHANNEL_COUNT) == 1) { "录音格式错误，请重录" }
            val csd = requireNotNull(format.getByteBuffer("csd-0"))
            require(((csd.get(0).toInt() and 0xff) shr 3) == 2) { "录音编码错误，请重录" }
            extractor.selectTrack(0)
            muxer = MediaMuxer(output.absolutePath, MediaMuxer.OutputFormat.MUXER_OUTPUT_MPEG_4)
            val track = muxer.addTrack(format)
            muxer.start()
            val buffer = ByteBuffer.allocate(65536)
            val info = MediaCodec.BufferInfo()
            var lastTimeUs = -1L
            val firstTimeUs = extractor.sampleTime
            while (extractor.sampleTime >= 0) {
                val timeUs = extractor.sampleTime - firstTimeUs
                if (!frameFits(timeUs, maxDurationMs)) break
                val size = extractor.readSampleData(buffer, 0)
                if (size < 0) break
                require(size <= buffer.capacity()) { "录音编码错误，请重录" }
                info.set(0, size, timeUs, 0)
                muxer.writeSampleData(track, buffer, info)
                lastTimeUs = timeUs
                extractor.advance()
            }
            require(lastTimeUs >= 0) { "录音太短，请重录" }
            muxer.stop()
            val duration = ceil((lastTimeUs + FRAME_SAMPLES * 1_000_000.0 / SAMPLE_RATE) / 1000).toInt()
            require(duration in 1..maxDurationMs)
            return output to duration
        } catch (error: Exception) {
            output.delete()
            throw error
        } finally {
            muxer?.release()
            extractor.release()
        }
    }
}
