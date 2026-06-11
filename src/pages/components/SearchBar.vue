<script setup>

defineProps({
    modelValue: String
})
defineEmits(['update:modelValue']);

</script>

<template>

<div class="search-box">
    <input 
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        type="text" 
        placeholder="Поиск по сайту или email..."
        class="search-input"
    >
</div>

</template>

<style>

.search-input {
    width: 100%;
    padding: 12px 16px;
    border: 1px solid rgba(107, 163, 255, 0.2);
    border-radius: 8px;
    font-size: 14px;
    background: rgba(42, 42, 52, 0.8);
    color: #F5F5F5;
    transition: all 0.2s;
}

.search-input::placeholder {
    color: rgba(180, 180, 190, 0.6);
}

.search-input:focus {
    outline: none;
    border-color: #6BA3FF;
    background: rgba(42, 42, 52, 1);
    box-shadow: 0 0 0 3px rgba(107, 163, 255, 0.15);
}

</style>