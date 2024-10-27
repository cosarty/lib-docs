<script setup lang="ts">
import { ref, onMounted } from "vue";

import Parabolic from "./Parabolic";

let parabolic: Parabolic;

const move = ref<HTMLElement>();
const middle = ref<HTMLElement>();
const right = ref<HTMLElement>();

const run = (e: Event) => {
  parabolic!
    .run(e)
    .then(() => {
      right.value!.style.transition = `all 0.25s`;
      right.value!.style.transform = "rotate(360deg)";
      setTimeout(() => {
        right.value!.style.transition = `all 0s`;
        right.value!.style.transform = "rotate(0deg)";
      }, 250);
      console.log("运动结束");
    })
    .catch(() => {
      console.warn("运动未结束");
    });
};

onMounted(() => {
  parabolic = new Parabolic(move.value!, middle.value!, right.value!, 10);
});
</script>

<template>
<div ref="parent" class="demo">
  <div class="run" @click="run">点击投掷</div>
  <div ref="move" class="move bg-green-300">移动</div>
  <div ref="middle" class="middle">顶点</div>
  <div ref="right" class="right bg-yellow-500">命中</div>
</div>
</template>

<style scoped lang="scss">
.flex {
  display: flex;
  justify-content: center;
  align-items: center;
}

.demo {
  width: 100%;
  color: #fff;

  .run {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 178px;
    height: 38px;
    background-color: #e89bac;
    cursor: pointer;
  }

  .point {
    position: fixed;
    width: 100px;
    height: 100px;
  }

  .move {
    position: fixed;
    width: 100px;
    height: 100px;

    top: 0;
    z-index: 1;
    display: none;
  }

  .middle {
    position: fixed;
    width: 100px;
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    right: 300px;
    bottom: 400px;
    border-radius: 50%;
    background-color: rgb(211, 80, 80);
  }

  .right {
    position: fixed;
    width: 100px;
    height: 100px;
    right: 40px;
    bottom: 150px;
    transition: all 0.25s;
  }
}
</style>
