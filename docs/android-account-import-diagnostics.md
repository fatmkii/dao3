# Android 账号导入临时诊断

## 背景

Android 0.2.2 内测期间，少部分生产用户在导入已有饼干时看到“账号操作没有完成，请稍后重试”。该提示原本会隐藏所有未分类异常，无法判断失败发生在响应解析、Android Keystore 加密还是 Room 数据库保存阶段。

本功能仅用于内测排障。正式公开发布前，应按本文末尾的清单评估并移除面向用户的诊断入口。

## 本次增加的行为

- 账号导入和领取流程把未分类异常划分为 `API_REQUEST`、`RESPONSE_PARSE`、`TOKEN_ENCRYPT` 和 `DATABASE_SAVE`。
- 发生上述异常时，在 `noBackupFilesDir/diagnostics.log` 追加一条有上限的本地 JSON 诊断记录。
- 错误提示附带随机的 8 位诊断编号。
- 仅在产生诊断记录的账号错误下方显示“复制诊断信息”；正常流程及服务端明确拒绝、网络错误、账号上限等情况不显示该按钮。
- 协程正常取消不会记录为账号失败。

诊断记录只包含时间、失败阶段、异常类及 cause 类名、应用版本、Android SDK、厂商、机型和所选域名。不得加入饼干、密码、Token、installation ID、SSAID、设备摘要、请求体、响应体或认证请求头。

## 涉及文件

- `android/app/src/main/java/com/cpttmm/app/diagnostics/DiagnosticLogger.kt`
- `android/app/src/main/java/com/cpttmm/app/account/MobileAuthCoordinator.kt`
- `android/app/src/main/java/com/cpttmm/app/network/HttpMobileApi.kt`
- `android/app/src/main/java/com/cpttmm/app/session/EncryptedSessionMapper.kt`
- `android/app/src/main/java/com/cpttmm/app/ui/WorkspaceStatusPages.kt`
- `android/app/src/main/java/com/cpttmm/app/ui/AddAccountSheet.kt`
- `android/app/src/main/java/com/cpttmm/app/CpttmmApplication.kt`
- `android/app/src/test/java/com/cpttmm/app/session/EncryptedSessionMapperTest.kt`
- `android/app/src/test/java/com/cpttmm/app/ui/AccountErrorMessageTest.kt`

## 内测反馈方式

让用户点击错误下方的“复制诊断信息”，将复制内容发给管理员。诊断信息中不包含账号凭据。可用诊断编号关联用户截图与复制内容。

## 正式发布前移除清单

1. 从 `AddAccountSheet` 移除诊断文本状态、剪贴板调用和“复制诊断信息”按钮。
2. 从 `accountErrorMessage` 移除面向用户显示的诊断编号，并删除 `accountDiagnosticText`。
3. 从 `MobileAuthCoordinator` 移除 `failureReporter`、`requestAndSave` 的诊断包装和 `AccountOperationException`；保留对 `CancellationException` 的正确处理。
4. 从 `CpttmmApplication` 移除向认证协调器注入 `diagnostics`。
5. 如果不再需要后台排障，删除 `AccountFailureReporter`、`AccountOperationStage` 和 `DiagnosticIncident`，并恢复 `DiagnosticLogger` 只记录原有事件。
6. 如果仍希望内部保留阶段分类，可以保留 `MobileSessionParseException` 和 `TokenEncryptionException`，但不要向普通用户展示诊断入口。
7. 删除只针对该临时功能的测试，并重新运行 Android debug/release 单元测试和 `lintDebug`。

移除时不要删除原有 WebView、刷新失败、文件选择和下载失败诊断事件；它们在本次修改之前已经存在。
