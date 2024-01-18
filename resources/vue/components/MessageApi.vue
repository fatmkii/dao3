<template>
    <div></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useMessage } from 'naive-ui'

// window.$message = useMessage()

export default defineComponent({
    setup() {
        window.$message = useMessage()
    },
})
</script>