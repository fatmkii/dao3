package com.cpttmm.app.registration

import org.junit.Assert.assertEquals
import org.junit.Assert.assertNull
import org.junit.Test

class RegistrationDeviceDigestTest {
    @Test
    fun `hashes the app scoped prefix and SSAID`() {
        assertEquals(
            "f7bf6653bfd57740bc6ab0761054bb7f5650fc6a10e6d84dfeedcdc0ba6c9e92",
            RegistrationDeviceDigest.fromSsaid("123456789abcdef"),
        )
    }

    @Test
    fun `refuses missing SSAID instead of falling back to installation id`() {
        assertNull(RegistrationDeviceDigest.fromSsaid(null))
        assertNull(RegistrationDeviceDigest.fromSsaid(""))
        assertNull(RegistrationDeviceDigest.fromSsaid("   "))
    }
}
