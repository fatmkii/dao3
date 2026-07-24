package com.cpttmm.app.account

import org.junit.Assert.assertEquals
import org.junit.Assert.assertNull
import org.junit.Assert.assertThrows
import org.junit.Test

class AccountAliasPolicyTest {
    @Test
    fun `accepts aliases up to ten display width units`() {
        assertNull(AccountAliasPolicy.validationError("abcdefghij"))
        assertNull(AccountAliasPolicy.validationError("饼干别名啊"))
        assertNull(AccountAliasPolicy.validationError("饼干#1"))
        assertNull(AccountAliasPolicy.validationError("中abcd中"))
    }

    @Test
    fun `rejects empty and oversized aliases`() {
        assertEquals("别名不能为空", AccountAliasPolicy.validationError("  "))
        assertEquals(
            "最多5中文或10英文",
            AccountAliasPolicy.validationError("abcdefghijk"),
        )
        assertEquals(
            "最多5中文或10英文",
            AccountAliasPolicy.validationError("六个中文字啊"),
        )
    }

    @Test
    fun `normalizes valid aliases and rejects invalid aliases`() {
        assertEquals("我的饼干", AccountAliasPolicy.requireValid("  我的饼干  "))
        assertThrows(IllegalArgumentException::class.java) {
            AccountAliasPolicy.requireValid("")
        }
    }

    @Test
    fun `uses the smallest available default number`() {
        assertEquals("饼干#2", AccountAliasPolicy.nextDefaultAlias(listOf("饼干#1", "饼干#3")))
        assertEquals("饼干#1", AccountAliasPolicy.nextDefaultAlias(listOf("常用", "饼干#2")))
    }
}
