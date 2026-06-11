<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import SearchBar from './components/SearchBar.vue'
import PasswordCard from './components/PasswordCard.vue'


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

const deletePassword = (id) => {
    passwords.value = passwords.value.filter(item => item.id !== id)
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
// Состояние модального окна
const showModal = ref(false)
const formData = ref({
    website: '',
    email: '',
    password: '',
    url: ''
})

// Открытие модального окна
const openAddPasswordModal = () => {
    formData.value = { website: '', email: '', password: '', url: '' }
    showModal.value = true
}

// Закрытие модального окна
const closeModal = () => {
    showModal.value = false
    formData.value = { website: '', email: '', password: '', url: '' }
}

// Добавление пароля из формы
const submitAddPassword = () => {
    const { website, email, password, url } = formData.value
    
    // Валидация
    if (!website.trim() || !email.trim() || !password.trim() || !url.trim()) {
        alert('✗ Пожалуйста, заполните все поля')
        return
    }
    
    // Создание нового пароля
    const newId = Math.max(...passwords.value.map(p => p.id), 0) + 1
    passwords.value.push({
        id: newId,
        website: website.trim(),
        email: email.trim(),
        password: password.trim(),
        url: url.trim()
    })
    
    alert('✓ Пароль успешно добавлен!')
    closeModal()
}

// Обработка Enter в форме
const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
        submitAddPassword()
    }
}



</script>

<template>
    <div class="password-manager">
        <!-- Кнопка назад -->
        <button @click="router.push('/')" class="back-btn">← Назад</button>
        
        <div class="load-panel">
        <button 
            @click="openAddPasswordModal"
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
        <SearchBar v-model="searchQuery" />

        <!-- Список паролей -->
        <div v-if="filteredPasswords.length > 0" class="passwords-list">
            <PasswordCard 
                v-for="item in filteredPasswords"
                :key="item.id"
                :item="item"
                @delete="deletePassword"
            />
        </div>

        <!-- Если ничего не найдено -->
        <div v-else class="empty-state">
            <p>🔍 Паролей не найдено</p>
        </div>

        <div v-if="showModal" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
        <div class="modal-header">
            <h2>Добавить новый пароль</h2>
            <button @click="closeModal" class="modal-close">✕</button>
        </div>

        <div class="modal-body">
            <div class="form-group">
                <label>Название сайта *</label>
                <input 
                    v-model="formData.website"
                    type="text" 
                    placeholder="Например: Gmail"
                    class="form-input"
                    @keypress="handleKeyPress"
                >
            </div>

            <div class="form-group">
                <label>Email или логин *</label>
                <input 
                    v-model="formData.email"
                    type="text" 
                    placeholder="user@example.com"
                    class="form-input"
                    @keypress="handleKeyPress"
                >
            </div>

            <div class="form-group">
                <label>Пароль *</label>
                <input 
                    v-model="formData.password"
                    type="password" 
                    placeholder="Введите пароль"
                    class="form-input"
                    @keypress="handleKeyPress"
                >
            </div>

            <div class="form-group">
                <label>URL сайта *</label>
                <input 
                    v-model="formData.url"
                    type="text" 
                    placeholder="example.com"
                    class="form-input"
                    @keypress="handleKeyPress"
                >
            </div>
        </div>

        <div class="modal-footer">
            <button @click="closeModal" class="modal-btn cancel-btn">
                Отмена
            </button>
            <button @click="submitAddPassword" class="modal-btn submit-btn">
                ✓ Добавить
            </button>
        </div>
    </div>
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


/* Список паролей */
.passwords-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
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

/* Модальное окно */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

.modal-content {
    background: linear-gradient(135deg, #1A1F2E 0%, #0F1419 100%);
    border-radius: 12px;
    border: 1px solid rgba(107, 163, 255, 0.2);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    width: 90%;
    max-width: 450px;
    animation: slideIn 0.3s ease;
}

@keyframes slideIn {
    from {
        transform: translateY(-20px);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    border-bottom: 1px solid rgba(107, 163, 255, 0.15);
}

.modal-header h2 {
    margin: 0;
    font-size: 18px;
    color: #F5F5F5;
    background: linear-gradient(135deg, #6BA3FF, #A78BFA);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.modal-close {
    background: none;
    border: none;
    color: #A0A0B0;
    font-size: 24px;
    cursor: pointer;
    padding: 0;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    transition: all 0.2s;
}

.modal-close:hover {
    color: #FF6B6B;
    background: rgba(255, 107, 107, 0.1);
}

.modal-body {
    padding: 20px;
}

.form-group {
    margin-bottom: 16px;
    display: flex;
    flex-direction: column;
}

.form-group:last-child {
    margin-bottom: 0;
}

.form-group label {
    font-size: 13px;
    color: #B0B0B0;
    margin-bottom: 6px;
    font-weight: 600;
}

.form-input {
    padding: 10px 12px;
    border: 1px solid rgba(107, 163, 255, 0.2);
    border-radius: 6px;
    background: rgba(25, 25, 35, 0.8);
    color: #F5F5F5;
    font-size: 14px;
    transition: all 0.2s;
    font-family: inherit;
}

.form-input::placeholder {
    color: rgba(180, 180, 190, 0.5);
}

.form-input:focus {
    outline: none;
    border-color: #6BA3FF;
    background: rgba(25, 25, 35, 1);
    box-shadow: 0 0 0 3px rgba(107, 163, 255, 0.15);
}

.modal-footer {
    display: flex;
    gap: 10px;
    padding: 16px 20px;
    border-top: 1px solid rgba(107, 163, 255, 0.15);
    justify-content: flex-end;
}

.modal-btn {
    padding: 10px 20px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    border: none;
    transition: all 0.2s;
    white-space: nowrap;
}

.cancel-btn {
    background: rgba(107, 163, 255, 0.1);
    color: #6BA3FF;
    border: 1px solid rgba(107, 163, 255, 0.2);
}

.cancel-btn:hover {
    background: rgba(107, 163, 255, 0.15);
    border-color: rgba(107, 163, 255, 0.4);
}

.submit-btn {
    background: linear-gradient(135deg, #52C41A, #45AA0A);
    color: white;
    box-shadow: 0 4px 12px rgba(82, 196, 26, 0.3);
}

.submit-btn:hover {
    background: linear-gradient(135deg, #6FD13C, #52C41A);
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(82, 196, 26, 0.4);
}

.submit-btn:active {
    transform: translateY(0);
}


</style>
