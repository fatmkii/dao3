package com.cpttmm.app.crypto

import androidx.test.ext.junit.runners.AndroidJUnit4
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotEquals
import org.junit.Assert.fail
import org.junit.Test
import org.junit.runner.RunWith

@RunWith(AndroidJUnit4::class)
class AndroidKeystoreTokenCipherTest {
    private val cipher = AndroidKeystoreTokenCipher()

    @Test
    fun roundTripUsesRandomizedCiphertext() {
        val first = cipher.encrypt("sensitive-token", "account-one")
        val second = cipher.encrypt("sensitive-token", "account-one")

        assertNotEquals(first, second)
        assertEquals("sensitive-token", cipher.decrypt(first, "account-one"))
        assertEquals("sensitive-token", cipher.decrypt(second, "account-one"))
    }

    @Test
    fun ciphertextCannotBeMovedToAnotherAccount() {
        val encrypted = cipher.encrypt("sensitive-token", "account-one")

        try {
            cipher.decrypt(encrypted, "account-two")
            fail("Account-bound additional data must reject swapped ciphertext")
        } catch (_: Exception) {
            // Expected authentication failure.
        }
    }
}
