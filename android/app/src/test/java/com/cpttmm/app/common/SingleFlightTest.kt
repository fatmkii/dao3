package com.cpttmm.app.common

import kotlinx.coroutines.async
import kotlinx.coroutines.awaitAll
import kotlinx.coroutines.delay
import kotlinx.coroutines.runBlocking
import org.junit.Assert.assertEquals
import org.junit.Test
import java.util.concurrent.atomic.AtomicInteger

class SingleFlightTest {
    @Test
    fun `concurrent calls for one account share one operation`() = runBlocking {
        val calls = AtomicInteger()
        val singleFlight = SingleFlight<String, String>()

        val results = (1..10).map {
            async {
                singleFlight.run("account-1") {
                    calls.incrementAndGet()
                    delay(50)
                    "refreshed"
                }
            }
        }.awaitAll()

        assertEquals(1, calls.get())
        assertEquals(List(10) { "refreshed" }, results)
    }

    @Test
    fun `different accounts do not block each other`() = runBlocking {
        val calls = AtomicInteger()
        val singleFlight = SingleFlight<String, String>()

        listOf("one", "two").map { account ->
            async {
                singleFlight.run(account) {
                    calls.incrementAndGet()
                    delay(20)
                    account
                }
            }
        }.awaitAll()

        assertEquals(2, calls.get())
    }
}
