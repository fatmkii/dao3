package com.cpttmm.app.ui

import com.cpttmm.app.account.AccountOperationException
import com.cpttmm.app.diagnostics.DiagnosticIncident
import com.cpttmm.app.network.MobileApiException
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNull
import org.junit.Test

class AccountErrorMessageTest {
    @Test
    fun `diagnosed failure exposes incident id and copy text`() {
        val failure = AccountOperationException(
            incident = DiagnosticIncident("7d842a19", "safe diagnostic report"),
            cause = IllegalStateException("secret internal detail"),
        )

        assertEquals(
            "账号操作没有完成，请稍后重试。诊断编号：7d842a19",
            accountErrorMessage(failure),
        )
        assertEquals("safe diagnostic report", accountDiagnosticText(failure))
    }

    @Test
    fun `expected api rejection keeps server message without diagnostic action`() {
        val failure = MobileApiException(21402, "饼干无法找到")

        assertEquals("饼干无法找到", accountErrorMessage(failure))
        assertNull(accountDiagnosticText(failure))
    }
}
