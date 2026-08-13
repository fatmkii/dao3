package com.cpttmm.app.webview

object WebAuthScript {
    fun bootstrapMessage(
        storageNamespace: String,
        binggan: String,
        accessToken: String,
        pendingStorageNamespaces: Set<String>,
        themeName: String,
    ): String = buildString {
        append("{\"type\":\"authBootstrap\",\"payload\":{")
        append("\"storageNamespace\":").append(javaScriptString(storageNamespace))
        append(",\"binggan\":").append(javaScriptString(binggan))
        append(",\"accessToken\":").append(javaScriptString(accessToken))
        append(",\"themeName\":").append(javaScriptString(themeName))
        append(",\"pendingStorageNamespaces\":[")
        pendingStorageNamespaces.forEachIndexed { index, namespace ->
            if (index > 0) append(',')
            append(javaScriptString(namespace))
        }
        append("]}}")
    }

    fun update(accessToken: String): String = buildString {
        append("window.dispatchEvent(new CustomEvent('cpttmm:auth-updated',{detail:{accessToken:")
        append(javaScriptString(accessToken))
        append("}}));void 0;")
    }

    fun themeMessage(themeName: String): String =
        "{\"type\":\"themeSelected\",\"payload\":{\"name\":${javaScriptString(themeName)}}}"

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
