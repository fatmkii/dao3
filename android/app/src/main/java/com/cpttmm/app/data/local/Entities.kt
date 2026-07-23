package com.cpttmm.app.data.local

import androidx.room.Entity
import androidx.room.ForeignKey
import androidx.room.Index
import androidx.room.PrimaryKey

@Entity(
    tableName = "accounts",
    indices = [Index(value = ["binggan"], unique = true)],
)
data class AccountEntity(
    @PrimaryKey val id: String,
    val binggan: String,
    val profileName: String,
    val cachedThemeName: String?,
    val accessExpiresAtMillis: Long,
    val idleExpiresAtMillis: Long,
    val lastUsedAtMillis: Long,
)

@Entity(
    tableName = "account_secrets",
    foreignKeys = [
        ForeignKey(
            entity = AccountEntity::class,
            parentColumns = ["id"],
            childColumns = ["accountId"],
            onDelete = ForeignKey.CASCADE,
        ),
    ],
)
data class AccountSecretEntity(
    @PrimaryKey val accountId: String,
    val encryptedAccessToken: String,
    val encryptedRefreshToken: String,
)

@Entity(
    tableName = "browser_tabs",
    foreignKeys = [
        ForeignKey(
            entity = AccountEntity::class,
            parentColumns = ["id"],
            childColumns = ["accountId"],
            onDelete = ForeignKey.CASCADE,
        ),
    ],
    indices = [Index("accountId")],
)
data class BrowserTabEntity(
    @PrimaryKey val id: String,
    val accountId: String,
    val path: String,
    val title: String,
    val scrollY: Int,
    val lastUsedAtMillis: Long,
)

@Entity(tableName = "pending_revocations", indices = [Index("accountId")])
data class PendingRevocationEntity(
    @PrimaryKey val id: String,
    val accountId: String,
    val encryptedRefreshToken: String,
    val createdAtMillis: Long,
)
