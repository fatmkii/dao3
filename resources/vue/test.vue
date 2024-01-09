
<template>
    <p>{{ counter_store.count }}</p>
    <button @click="counter_store.increment">+1</button>
</template>
 

<script setup>
import { ref } from 'vue'
import { useCounterStore } from '@/store.js'

const counter_store = useCounterStore();
function increment() {
    counter_store.count++
}



</script>
