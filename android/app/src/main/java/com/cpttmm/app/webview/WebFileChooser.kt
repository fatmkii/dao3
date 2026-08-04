package com.cpttmm.app.webview

internal enum class WebFileChooserRoute {
    PHOTO_PICKER,
    GENERIC_CHOOSER,
}

internal fun webFileChooserRoute(
    acceptTypes: Array<String>,
    isSingleOpenRequest: Boolean,
): WebFileChooserRoute {
    val normalizedTypes =
        acceptTypes
            .flatMap { it.split(',') }
            .map { it.trim().lowercase() }
            .filter { it.isNotEmpty() }

    return if (isSingleOpenRequest && normalizedTypes == listOf("image/*")) {
        WebFileChooserRoute.PHOTO_PICKER
    } else {
        WebFileChooserRoute.GENERIC_CHOOSER
    }
}

internal class PendingWebFileChooser<T> {
    private var callback: ((T?) -> Unit)? = null

    fun replace(newCallback: (T?) -> Unit) {
        callback?.invoke(null)
        callback = newCallback
    }

    fun complete(value: T?) {
        val completedCallback = callback
        callback = null
        completedCallback?.invoke(value)
    }

    fun clear() {
        complete(null)
    }
}
