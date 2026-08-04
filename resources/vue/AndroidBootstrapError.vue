<script setup lang="ts">
defineEmits<{ retry: [] }>()
</script>

<template>
    <main class="bootstrap-error">
        <h1 class="bootstrap-error__title">初始化失败</h1>
        <p class="bootstrap-error__message">无法从 Android 应用读取登录信息，请重试。</p>
        <button class="bootstrap-error__button" type="button" @click="$emit('retry')">重试</button>
    </main>
</template>

<style scoped>
.bootstrap-error {
    display: grid;
    min-height: 100vh;
    place-content: center;
    padding: 24px;
    text-align: center;
}

.bootstrap-error__title {
    margin: 0 0 12px;
}

.bootstrap-error__message {
    margin: 0 0 20px;
}

.bootstrap-error__button {
    min-height: 44px;
    padding: 0 24px;
}
</style>
