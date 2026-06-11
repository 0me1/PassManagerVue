<script setup>
import { ref } from 'vue'

</script>

<template>
    <p>123</p>
    <div>
        <button @click="$emit('back')" class="start-btn">
        назад
        </button>
    </div>

</template>