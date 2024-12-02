<template>
  <div>
    <Collapse title="设置" @vue:mounted="onMounted">
      <div class="w-full h-32 bg-red-500">我是儿子</div>
    </Collapse>
  </div>
</template>

<script setup lang="ts">
import Collapse from './Collapse.vue'

const onMounted = ()=>{
  console.log('我挂在了')
}
</script>

<style scoped lang="scss"></style>

