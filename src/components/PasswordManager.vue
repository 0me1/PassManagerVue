<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const passwords = ref([
    {
        id: 1,
        website: 'Gmail',
        email: 'user@gmail.com',
        password: 'SecurePass123!',
        url: 'mail.google.com'
    },
    {
        id: 2,
        website: 'GitHub',
        email: 'john.doe',
        password: 'GitHubPass456#',
        url: 'github.com'
    },
    {
        id: 3,
        website: 'Netflix',
        email: 'user@example.com',
        password: 'Netflix789*',
        url: 'netflix.com'
    }
])

const searchQuery = ref('')
const visiblePasswords = ref({})
const copiedId = ref(null)
const isLoading = ref(false)

const filteredPasswords = computed(() => {
    return passwords.value.filter(item => 
        item.website.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        item.email.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
})

const togglePasswordVisibility = (id) => {
    visiblePasswords.value[id] = !visiblePasswords.value[id]
}

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

const deletePassword = (id) => {
    passwords.value = passwords.value.filter(item => item.id !== id)
}

const maskPassword = (password) => {
    return '•'.repeat(password.length)
}

// 🔥 ЗАГРУЗКА ИЗ ПУБЛИЧНОГО ФАЙЛА
const loadPasswordsFromFile = async () => {
    isLoading.value = true
    try {
        const response = await fetch('/passwords.json')
        if (!response.ok) {
            throw new Error('Файл не найден. Поместите passwords.json в папку public')
        }
        const data = await response.json()
        if (!Array.isArray(data)) {
            throw new Error('Неверный формат файла')
        }
        passwords.value = data
        alert('✓ Пароли успешно загружены!')
    } catch (error) {
        alert('✗ Ошибка загрузки: ' + error.message)
        console.error('Ошибка:', error)
    } finally {
        isLoading.value = false
    }
}

// ЗАГРУЗКА ИЗ ФАЙЛА НА КОМПЬЮТЕРЕ
const loadPasswordsFromUpload = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    
    isLoading.value = true
    try {
        const text = await file.text()
        const data = JSON.parse(text)
        
        if (!Array.isArray(data)) {
            throw new Error('Неверный формат файла. Ожидается массив объектов')
        }
        
        passwords.value = data
        alert('✓ Пароли успешно загружены из файла!')
        event.target.value = '' // Сброс input
    } catch (error) {
        alert('✗ Ошибка чтения файла: ' + error.message)
        console.error('Ошибка:', error)
    } finally {
        isLoading.value = false
    }
}

// ЗАГРУЗКА С ЛОКАЛЬНОГО СЕРВЕРА
const loadPasswordsFromAPI = async () => {
    isLoading.value = true
    try {
        const response = await fetch('http://localhost:3000/api/passwords')
        if (!response.ok) {
            throw new Error('Сервер недоступен (http://localhost:3000)')
        }
        const data = await response.json()
        if (!Array.isArray(data)) {
            throw new Error('Неверный формат данных с сервера')
        }
        passwords.value = data
        alert('✓ Пароли загружены с сервера!')
    } catch (error) {
        alert('✗ Ошибка загрузки: ' + error.message)
        console.error('Ошибка:', error)
    } finally {
        isLoading.value = false
    }
}

// ДОБАВЛЕНИЕ НОВОГО ПАРОЛЯ
const addPassword = () => {
    const newPassword = prompt('Введите новый пароль в формате JSON:\n{"website":"...","email":"...","password":"...","url":"..."}')
    if (!newPassword) return
    
    try {
        const data = JSON.parse(newPassword)
        const newId = Math.max(...passwords.value.map(p => p.id), 0) + 1
        passwords.value.push({
            id: newId,
            ...data
        })
        alert('✓ Пароль добавлен!')
    } catch {
        alert('✗ Неверный формат JSON')
    }
}

// ЭКСПОРТ ПАРОЛЕЙ В JSON
const exportPasswords = (data = passwords.value, fileName = null) => {
    const jsonString = JSON.stringify(data, null, 2)
    const blob = new Blob([jsonString], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = fileName || `passwords_${new Date().toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
    alert(`✓ Экспортировано ${data.length} пароль(ей)!`)
}

const exportAllPasswords = () => {
    exportPasswords()
}

const exportCurrentPasswords = () => {
    if (filteredPasswords.value.length === 0) {
        alert('✗ Нечего экспортировать. Результаты поиска пусты.')
        return
    }
    exportPasswords(filteredPasswords.value, `passwords_filtered_${new Date().toISOString().split('T')[0]}.json`)
}


</script>

<template>
    <div class="password-manager">
        <!-- Кнопка назад -->
        <button @click="router.push('/')" class="back-btn">← Назад</button>
        
        <div class="load-panel">
            <button 
                @click="addPassword"
                :disabled="isLoading"
                class="load-btn add-btn"
            >
                ➕ Добавить
            </button>

            <button 
            @click="loadPasswordsFromFile" 
            :disabled="isLoading"
            class="load-btn"
            >
            {{ isLoading ? '⏳ Загрузка...' : '📥 Из файла' }}
        </button>
            
            <label class="file-input-label">
                <input 
                    type="file" 
                    accept=".json"
                    @change="loadPasswordsFromUpload"
                    :disabled="isLoading"
                    class="file-input"
                >
                {{ isLoading ? '⏳ Загрузка...' : '📤 Выбрать JSON' }}
            </label>

            <button 
                @click="loadPasswordsFromAPI" 
                :disabled="isLoading"
                class="load-btn"
            >
                {{ isLoading ? '⏳ Загрузка...' : '🌐 С сервера' }}
            </button>


            <div class="load-separator"></div>

            <button 
                @click="exportAllPasswords"
                :disabled="passwords.length === 0"
                class="load-btn export-btn"
            >
                💾 Экспортировать все
            </button>

            <button 
                @click="exportCurrentPasswords"
                :disabled="filteredPasswords.length === 0"
                class="load-btn export-btn"
                title="Экспортирует результаты текущего поиска"
            >
                📊 Экспортировать поиск
            </button>
        </div>


        <!-- Поиск -->
        <div class="search-box">
            <input 
                v-model="searchQuery"
                type="text" 
                placeholder="Поиск по сайту или email..."
                class="search-input"
            >
        </div>

        <!-- Список паролей -->
        <div v-if="filteredPasswords.length > 0" class="passwords-list">
            <div 
                v-for="item in filteredPasswords" 
                :key="item.id"
                class="password-item"
            >
                <div class="password-header">
                    <div class="website-info">
                        <h2 class="website-name">{{ item.website }}</h2>
                        <p class="email">{{ item.email }}</p>
                        <p class="url">{{ item.url }}</p>
                    </div>
                    <button 
                        @click="deletePassword(item.id)"
                        class="delete-btn"
                        title="Удалить"
                    >
                        ✕
                    </button>
                </div>

                <div class="password-field">
                    <div class="password-display">
                        <span class="password-text">
                            {{ visiblePasswords[item.id] ? item.password : maskPassword(item.password) }}
                        </span>
                    </div>

                    <div class="password-actions">
                        <button 
                            @click="togglePasswordVisibility(item.id)"
                            class="action-btn"
                            :title="visiblePasswords[item.id] ? 'Скрыть' : 'Показать'"
                        >
                            {{ visiblePasswords[item.id] ? '👁️' : '👁️‍🗨️' }}
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
        </div>

        <!-- Если ничего не найдено -->
        <div v-else class="empty-state">
            <p>🔍 Паролей не найдено</p>
        </div>
    </div>
</template>

<style scoped>
* {
    box-sizing: border-box;
}

.password-manager {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    min-height: 100vh;
    background: linear-gradient(135deg, #0F1419 0%, #1A1F2E 100%);
}

.back-btn {
    background: rgba(107, 163, 255, 0.15);
    color: #6BA3FF;
    border: 1px solid rgba(107, 163, 255, 0.3);
    padding: 10px 20px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 20px;
    transition: all 0.2s;
}

.back-btn:hover {
    background: rgba(107, 163, 255, 0.25);
    border-color: rgba(107, 163, 255, 0.5);
}

.header {
    margin-bottom: 25px;
    text-align: center;
    color: #F5F5F5;
}

.header h1 {
    font-size: 28px;
    margin: 0 0 8px 0;
    background: linear-gradient(135deg, #6BA3FF, #A78BFA);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.subtitle {
    font-size: 14px;
    margin: 0;
    opacity: 0.8;
    color: #B0B0B0;
}

/* Панель загрузки */
.load-panel {
    display: flex;
    gap: 10px;
    margin-bottom: 25px;
    flex-wrap: wrap;
    background: rgba(42, 42, 52, 0.8);
    padding: 15px;
    border-radius: 8px;
    border: 1px solid rgba(107, 163, 255, 0.2);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(10px);
}

.load-btn, .file-input-label {
    background: linear-gradient(135deg, #6BA3FF, #5A8FE8);
    color: white;
    border: none;
    padding: 10px 16px;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
    box-shadow: 0 4px 12px rgba(107, 163, 255, 0.3);
}

.load-btn:hover:not(:disabled),
.file-input-label:hover {
    background: linear-gradient(135deg, #7EB3FF, #6BA3FF);
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(107, 163, 255, 0.4);
}

.load-btn:disabled,
.file-input-label:has(input:disabled) {
    opacity: 0.6;
    cursor: not-allowed;
}

.add-btn {
    background: linear-gradient(135deg, #52C41A, #45AA0A);
    box-shadow: 0 4px 12px rgba(82, 196, 26, 0.3);
}

.add-btn:hover:not(:disabled) {
    background: linear-gradient(135deg, #6FD13C, #52C41A);
    box-shadow: 0 6px 16px rgba(82, 196, 26, 0.4);
}

.file-input {
    display: none;
}

.file-input-label {
    display: inline-block;
    cursor: pointer;
}

/* Поиск */
.search-box {
    margin-bottom: 25px;
}

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

/* Список паролей */
.passwords-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

/* Элемент пароля */
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

/* Пустое состояние */
.empty-state {
    text-align: center;
    padding: 40px 20px;
    color: #B0B0B0;
    font-size: 16px;
    background: rgba(107, 163, 255, 0.08);
    border-radius: 8px;
    margin-top: 20px;
    border: 1px solid rgba(107, 163, 255, 0.15);
}

</style>
