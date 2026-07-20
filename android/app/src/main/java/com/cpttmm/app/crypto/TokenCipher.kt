package com.cpttmm.app.crypto

interface TokenCipher {
    fun encrypt(plaintext: String, accountId: String): String

    fun decrypt(ciphertext: String, accountId: String): String
}
