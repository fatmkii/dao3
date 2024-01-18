
<template>
    <n-flex justify="center">
        <div style="height: 100vw">{{ forumsStore.forumsData[0] }}</div>
    </n-flex>
</template>

<script setup lang="ts">
import { NFlex } from 'naive-ui'

import { useForumsStore } from '@/stores/forums'

//各版数据的store
const forumsStore = useForumsStore()

</script>

