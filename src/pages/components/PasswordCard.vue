<script setup>
import { ref } from 'vue'

defineProps({
    item: Object,
    required: true
})

defineEmits(['delete', 'copy'])

const isVisible = ref(false)
const copiedId = ref(null)

const copyToClipboard = async (password, id) => {
    try {
        await navigator.clipboard.writeText(password)
        copiedId.value = id
        setTimeout(() => {
            copiedId.value = null
        }, 2000)
    } catch (error) {
        console.error('Ошибка копирования:', error)
    }
}

const maskPassword = (password) => {
    return '•'.repeat(password.length)
}

</script>

<template>

    <div class="password-item">
        <div class="password-header">
            <div class="website-info">
                <h2 class="website-name">{{ item.website }}</h2>
                <p class="email">{{ item.email }}</p>
                <p class="url">{{ item.url }}</p>
            </div>
            <button 
                @click="$emit('delete', item.id)"
                class="delete-btn"
                title="Удалить"
            >
                ✕
            </button>
        </div>

        <div class="password-field">
            <div class="password-display">
                <span class="password-text">
                    {{ isVisible ? item.password : maskPassword(item.password) }}
                </span>
            </div>

            <div class="password-actions">
                <button 
                    @click="isVisible = !isVisible"
                    class="action-btn"
                    :title="isVisible ? 'Скрыть' : 'Показать'"
                >
                    {{ isVisible ? '👁️' : '👁️‍🗨️' }}
                </button>

                <button 
                    @click="copyToClipboard(item.password, item.id)"
                    class="action-btn copy-btn"
                    :class="{ copied: copiedId === item.id }"
                >
                    {{ copiedId === item.id ? '✓ Скопировано' : '📋' }}
                </button>
            </div>
        </div>
    </div>

</template>

<style>
.password-item {
    background: rgba(42, 42, 52, 0.8);
    border-radius: 8px;
    padding: 16px;
    border: 1px solid rgba(107, 163, 255, 0.15);
    transition: all 0.2s;
    backdrop-filter: blur(10px);
}

.password-item:hover {
    background: rgba(42, 42, 52, 1);
    border-color: rgba(107, 163, 255, 0.3);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

/* Заголовок элемента */
.password-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 12px;
}

.website-info {
    flex: 1;
}

.website-name {
    font-size: 18px;
    margin: 0 0 6px 0;
    color: #F5F5F5;
    font-weight: 600;
}

.email {
    font-size: 13px;
    color: #A0A0B0;
    margin: 0 0 4px 0;
}

.url {
    font-size: 12px;
    color: #707080;
    margin: 0;
}

/* Кнопка удаления */
.delete-btn {
    background: none;
    border: none;
    color: #707080;
    font-size: 20px;
    cursor: pointer;
    padding: 0;
    transition: color 0.2s;
    min-width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.delete-btn:hover {
    color: #FF6B6B;
}

/* Поле пароля */
.password-field {
    display: flex;
    gap: 8px;
    align-items: center;
    background: rgba(25, 25, 35, 0.8);
    padding: 10px 12px;
    border-radius: 6px;
    border: 1px solid rgba(107, 163, 255, 0.1);
}

.password-display {
    flex: 1;
    font-family: 'Courier New', monospace;
    font-size: 14px;
    color: #B0D4FF;
    user-select: none;
}

.password-text {
    letter-spacing: 2px;
}

/* Кнопки действий */
.password-actions {
    display: flex;
    gap: 8px;
}

.action-btn {
    background: rgba(107, 163, 255, 0.1);
    border: 1px solid rgba(107, 163, 255, 0.2);
    padding: 6px 10px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    color: #6BA3FF;
    transition: all 0.2s;
    min-width: 40px;
}

.action-btn:hover {
    background: rgba(107, 163, 255, 0.2);
    border-color: rgba(107, 163, 255, 0.4);
    color: #7EB3FF;
}

.action-btn.copied {
    background: rgba(82, 196, 26, 0.2);
    color: #52C41A;
    border-color: rgba(82, 196, 26, 0.4);
}

</style>