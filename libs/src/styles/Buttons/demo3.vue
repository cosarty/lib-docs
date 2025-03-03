<template>
  <div class="card"><span>流光卡片</span></div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.card {
  position: relative;
  width: 300px;
  height: 400px;
  background: rgba(0, 0, 0.75);
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  margin: 0 auto;
  cursor: pointer;
  &::before {
    content: '';
    position: absolute;
    width: 500px;
    height: 500px;
    background-image: conic-gradient(
      transparent,
      transparent,
      transparent,
      #00ccff
    );
    animation: cardAnimate 4s linear infinite;
  }
  &::after {
    content: '';
    position: absolute;
    width: 500px;
    height: 500px;
    background-image: conic-gradient(
      transparent,
      transparent,
      transparent,
      #de44d4
    );
    animation: cardAnimate 4s linear infinite;
    animation-delay: -2s;
  }

  span {
    position: absolute;
    inset: 5px;
    border-radius: 16px;
    background-color: #0c1022;
    z-index: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 40px;
    color: #fff;
  }
}

@keyframes cardAnimate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>

