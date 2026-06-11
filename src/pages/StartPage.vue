<script setup>

import { useRouter } from 'vue-router'

const router = useRouter()

</script>

<template>
  <div class="start-page">
    <div class="container">
      <div class="content">
        <h1 class="title">МЕНЕДЖЕР ПАРОЛЕЙ</h1>
        <p class="description">«Пароли как котята — каждый сам по себе, но ты знаешь где они» (с) дипсик, 2026 г.<br>
        Помнишь, как Фрирен хранила всё в своей сумке? Здесь то же самое, но для паролей.</p>

        <div class="features">
          <div class="feature">
            <span class="icon">🍂</span>
            <h2 class="feature-title">Всё под рукой</h2>
            <p>Быстрый поиск среди всех паролей</p>
          </div>
          <div class="feature">
            <span class="icon">🧣</span>
            <h2 class="feature-title">С заботой</h2>
            <p>Волнуемся о твоих данных, чтобы ты не волновался</p>
          </div>
          <div class="feature">
            <span class="icon">🎀</span>
            <h2 class="feature-title">Копирование</h2>
            <p>Магия одного касания — и пароль у тебя</p>
          </div>
        </div>
          <div>
          <button @click="router.push('/manager')" class="start-btn">
            открыть менеджер →
          </button>

          <button @click="router.push('/info')" class="start-btn">
            открыть about
          </button>
          </div>


      </div>
    </div>
  </div>
</template>

<style scoped>

* {
  font-family: 'comfortaa', comfortaa;
}

.start-page {
  display: flex;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
  background-image: url('/1405985.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.container {
  max-width: 620px;
  width: 100%;
}

.content {
  text-align: center;
  border-radius: 16px;
  padding: 60px 10px;
}

.title {
  font-size: 38px;
  font-weight: 900;
  color: #831830;
  margin: 0 0 16px 0;
}

.description {
  font-size: 17px;
  color: #5b3a3a;
  margin: 0 0 20px 0;
}

.start-btn {
  background: linear-gradient(135deg, #6173c5 0%, #745097 100%);
  color: white;
  border: none;
  padding: 15px 40px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 50px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  margin-top: 20px;
}

.start-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(21, 26, 52, 0.4);
}

.start-btn:active {
  transform: translateY(0);
}

.features {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-top: 20px;
  margin-bottom: 7px;
}

.feature {
  border-radius: 8px;
}

.feature-title {
  font-size: 16px;
  font-weight: 900;
  margin: 5px 0 5px 0;
  color: #831830;
}

.feature .icon {
  font-size: 28px;
  display: block;
  margin-bottom: 5px;
}

.feature p {
  margin: 0;
  font-size: 13px;
  color: #5b3a3a;
  font-weight: 500;
}
</style>
