<script setup lang="ts">
import { vWaveDiffuse } from "./vWaveDiffuse";
</script>

<template>
<div v-wave-diffuse="'rgba(100,100,100,0.5)'" class="wave-diffuse border-solid border border-gray-200 ">Hello</div>
</template>

<style scoped lang="scss">
.wave-diffuse {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 250px;
  height: 75px;
  font-size: 25px;
  cursor: pointer;
  user-select: none;
}
</style>
