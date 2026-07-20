package com.cpttmm.app.common

import kotlinx.coroutines.CompletableDeferred
import java.util.concurrent.ConcurrentHashMap

class SingleFlight<K, V> {
    private val flights = ConcurrentHashMap<K, CompletableDeferred<V>>()

    suspend fun run(key: K, block: suspend () -> V): V {
        val candidate = CompletableDeferred<V>()
        val active = flights.putIfAbsent(key, candidate)
        if (active != null) return active.await()

        try {
            val result = block()
            candidate.complete(result)

            return result
        } catch (throwable: Throwable) {
            candidate.completeExceptionally(throwable)
            throw throwable
        } finally {
            flights.remove(key, candidate)
        }
    }
}
