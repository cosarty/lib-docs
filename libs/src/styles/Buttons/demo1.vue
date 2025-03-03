<template>
  <div class="content">
    <div class="btn"><span>流光按钮</span></div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.content {
  width: 100%;
  height: 100%;
  background-color: rgb(18, 19, 19);
  padding: 10px;
}
.btn {
  margin: 0 auto;
  cursor: pointer;
  width: 130px;
  height: 50px;
  border-radius: 20px;
  position: relative;
  overflow: hidden;
  background-color: #eeeeee22;
  &::before {
    content: '';
    width: calc(100% - 6px);
    height: calc(100% - 6px);
    background-color: black;
    border-radius: 20px;
    top: 3px;
    left: 3px;
    position: absolute;
    z-index: 2;
  }
  &::after {
    content: '';
    width: 300%;
    height: 300%;
    border-radius: 20px;
    position: absolute;
    top: -100%;
    left: -100%;
    z-index: 1;
    background-image: conic-gradient(
      #fc979e,
      #e7d0fe,
      #02eded,
      #adf674,
      #eeeeee22 30%
    );
    animation: rotate 1.5s linear infinite;
  }

  span {
    color: #fc979e;
    position: absolute;
    z-index: 3;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-weight: bold;
  }
}
@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}
</style>

