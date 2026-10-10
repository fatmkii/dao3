package com.cpttmm.app.webview

import com.cpttmm.app.recording.RecordingAudio
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

class RecordingAudioTest {
    @Test fun trimsOnlyWholeFramesWithinTheBackendLimit() {
        assertTrue(RecordingAudio.frameFits(0, 15000))
        assertTrue(RecordingAudio.frameFits(14976780, 15000))
        assertFalse(RecordingAudio.frameFits(14976781, 15000))
        assertFalse(RecordingAudio.frameFits(15000000, 15000))
        assertFalse(RecordingAudio.frameFits(-1, 15000))
        assertFalse(RecordingAudio.frameFits(0, 20))
        assertTrue(RecordingAudio.frameFits(29976780, 30000))
    }
}
