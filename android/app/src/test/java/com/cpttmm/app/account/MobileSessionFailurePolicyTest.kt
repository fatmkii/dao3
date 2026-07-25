package com.cpttmm.app.account

import com.cpttmm.app.network.MobileApiException
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test
import java.io.IOException

class MobileSessionFailurePolicyTest {
    @Test
    fun `server rejection is a terminal refresh failure`() {
        assertTrue(MobileApiException(21401, "移动会话已失效").isTerminalRefreshFailure())
        assertTrue(MobileApiException(401, "Unauthorized").isTerminalRefreshFailure())
    }

    @Test
    fun `network and server availability failures are retryable`() {
        assertFalse(IOException("offline").isTerminalRefreshFailure())
        assertFalse(MobileApiException(500, "暂时不可用").isTerminalRefreshFailure())
        assertFalse(MobileApiException(404, "接口尚未部署").isTerminalRefreshFailure())
    }
}
