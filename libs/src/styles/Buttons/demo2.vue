<template>
  <div class="box">
    <div class="btn2">
      <span>流光按钮</span>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.box {
  text-align: center;
}
.btn2 {
  position: relative;
  display: inline-block;
  width: 200px;
  height: 60px;
  background-color: skyblue;
  color: #fff;
  line-height: 60px;
  text-align: center;
  text-decoration: none;
  background: linear-gradient(90deg, #03a9f4, #f441a5, #ffeb3b, #03a9f4);
  background-size: 400%;
  border-radius: 10px;
  cursor: pointer;
  &:hover {
    animation: btn2Animate 8s linear infinite;
    &::before {
      filter: blur(10px);
      opacity: 1;
    }
  }
  &::before {
    content: '';
    position: absolute;
    left: -5px;
    top: -5px;
    right: -5px;
    bottom: -5px;
    z-index: -1;
    background: linear-gradient(90deg, #03a9f4, #f441a5, #ffeb3b, #03a9f4);
    background-size: 400%;
    border-radius: 10px;
    opacity: 0;
    transition: all 1s;
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

@keyframes btn2Animate {
  0% {
    background-position: 0%;
  }
  100% {
    background-position: 400% 0;
  }
}
</style>

