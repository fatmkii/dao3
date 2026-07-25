package com.cpttmm.app.account

object AccountAliasPolicy {
    private const val MAX_DISPLAY_WIDTH = 10
    private const val DEFAULT_PREFIX = "饼干#"

    fun normalize(alias: String): String = alias.trim()

    fun validationError(alias: String): String? {
        val normalized = normalize(alias)
        return when {
            normalized.isEmpty() -> "别名不能为空"
            displayWidth(normalized) > MAX_DISPLAY_WIDTH -> "最多5中文或10英文"
            else -> null
        }
    }

    fun requireValid(alias: String): String {
        val normalized = normalize(alias)
        val error = validationError(normalized)
        require(error == null) { error ?: "" }
        return normalized
    }

    fun nextDefaultAlias(existingAliases: Collection<String>): String {
        val usedNumbers =
            existingAliases
                .mapNotNull { alias ->
                    alias.removePrefix(DEFAULT_PREFIX)
                        .takeIf { alias.startsWith(DEFAULT_PREFIX) }
                        ?.toIntOrNull()
                }
                .toSet()
        val number = generateSequence(1) { it + 1 }.first { it !in usedNumbers }
        return "$DEFAULT_PREFIX$number"
    }

    internal fun displayWidth(alias: String): Int =
        alias.codePoints().map { if (it <= 0x7f) 1 else 2 }.sum()
}
