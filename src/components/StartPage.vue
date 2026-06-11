<script setup>
defineEmits(['navigate'])
</script>

<template>
  <div class="start-page">
    <div class="container">
      <div class="content">
        <h1 class="title">🔐 Менеджер Паролей</h1>
        <p class="description">Безопасно сохраняйте и управляйте вашими паролями</p>
        
        <button @click="$emit('navigate')" class="start-btn">
          Открыть менеджер
        </button>

        <div class="features">
          <div class="feature">
            <span class="icon">🔒</span>
            <p>Безопасное хранение</p>
          </div>
          <div class="feature">
            <span class="icon">🔍</span>
            <p>Быстрый поиск</p>
          </div>
          <div class="feature">
            <span class="icon">📋</span>
            <p>Копирование в один клик</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.start-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
}

.container {
  max-width: 500px;
  width: 100%;
}

.content {
  text-align: center;
  background: white;
  border-radius: 16px;
  padding: 60px 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.title {
  font-size: 36px;
  margin: 0 0 16px 0;
  color: #333;
  font-weight: 700;
}

.description {
  font-size: 16px;
  color: #666;
  margin: 0 0 40px 0;
}

.start-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 16px 48px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  margin-bottom: 40px;
}

.start-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
}

.start-btn:active {
  transform: translateY(0);
}

.features {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-top: 30px;
}

.feature {
  padding: 20px;
  background: #f5f5f5;
  border-radius: 8px;
}

.feature .icon {
  font-size: 28px;
  display: block;
  margin-bottom: 10px;
}

.feature p {
  margin: 0;
  font-size: 13px;
  color: #666;
  font-weight: 500;
}
</style>
