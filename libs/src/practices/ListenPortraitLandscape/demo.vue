<template>
  <div>
    {{ str }}
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useListenPortraitLandscape } from './useListenPortraitLandscape';
const str = ref('请继续。。。')
useListenPortraitLandscape({
  portraitCallback: () => {
    str.value = '为了更好的观看体验，请您保持竖屏或全屏观看'    
  },
  landscapeCallback: () => {
    str.value = '请继续。。。'
  },
})
</script>

<style lang="scss" scoped></style>
