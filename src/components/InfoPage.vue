<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
    <p>123</p>
    <div>
        <button @click="router.push('/')" class="start-btn">
        назад
        </button>
    </div>

</template>