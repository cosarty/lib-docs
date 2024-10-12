<template>
  <div>
    <ElButton>测试哈哈哈</ElButton>
    <button class="bg-green-300">测试</button>
    {{ name }}
  </div>
</template>

<script setup>
import { ElButton } from 'element-plus';
import { ref } from 'vue';
const name = ref('蔡夏柠');
</script>

<style lang="scss" scoped></style>
