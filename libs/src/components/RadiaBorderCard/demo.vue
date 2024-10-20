<template>
  <div class="space-y-[20px]">
    <ElRow :gutter="20">
      <ElCol :span="8" v-for="num in 3" :key="num">
        <RadiaBorderCard class="bg-red-200">{{ num }}</RadiaBorderCard>
      </ElCol>
    </ElRow>
    <ElRow :gutter="20">
      <ElCol :span="6" v-for="num in 4" :key="num">
        <RadiaBorderCard class="bg-blue-200">{{ num }}</RadiaBorderCard>
      </ElCol>
    </ElRow>
  </div>
</template>

<script setup lang="ts">
import RadiaBorderCard from './index.vue'
import { ElRow, ElCol } from 'element-plus'
</script>

