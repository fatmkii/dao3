package com.cpttmm.app.webview

object WebAuthScript {
    fun documentStart(binggan: String, accessToken: String): String = buildScript(
        binggan = binggan,
        accessToken = accessToken,
        dispatchUpdate = false,
    )

    fun update(accessToken: String): String = buildString {
        append("localStorage.setItem('Token',")
        append(javaScriptString(accessToken))
        append(");window.dispatchEvent(new CustomEvent('cpttmm:auth-updated'));void 0;")
    }

    private fun buildScript(
        binggan: String,
        accessToken: String,
        dispatchUpdate: Boolean,
    ): String = buildString {
        append("localStorage.setItem('Binggan',")
        append(javaScriptString(binggan))
        append(");localStorage.setItem('Token',")
        append(javaScriptString(accessToken))
        append(");")
        if (dispatchUpdate) {
            append("window.dispatchEvent(new CustomEvent('cpttmm:auth-updated'));")
        }
        append("void 0;")
    }

    private fun javaScriptString(value: String): String = buildString {
        append('"')
        value.forEach { character ->
            when (character) {
                '"' -> append("\\\"")
                '\\' -> append("\\\\")
                '\b' -> append("\\b")
                '\u000C' -> append("\\f")
                '\n' -> append("\\n")
                '\r' -> append("\\r")
                '\t' -> append("\\t")
                '<' -> append("\\u003c")
                '>' -> append("\\u003e")
                '&' -> append("\\u0026")
                '\u2028' -> append("\\u2028")
                '\u2029' -> append("\\u2029")
                else -> {
                    if (character.code < 0x20) {
                        append("\\u")
                        append(character.code.toString(16).padStart(4, '0'))
                    } else {
                        append(character)
                    }
                }
            }
        }
        append('"')
    }
}
