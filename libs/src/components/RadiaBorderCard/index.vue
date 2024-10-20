<template>
  <div
    class="border-solid border-[2px] rounded-[5px] border-transparent cursor-pointer relative"
    :style="{
      borderImage:
        'radial-gradient(150px circle at var(--x) var(--y),red  0,transparent 100%)',
      borderImageSlice: 1,
      clipPath: 'inset(0 round 5px)',
    }"
    ref="container"
  >
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, useTemplateRef } from 'vue';
import { useRadialBorder } from './useRadialBorder';

const containerBoxRef = useTemplateRef<HTMLElement>('container');

const { enableRadialBorder, disableRadialBorder } =
  useRadialBorder(containerBoxRef);

window.addEventListener('mouseenter', enableRadialBorder);
window.addEventListener('mouseleave', disableRadialBorder);

onMounted(enableRadialBorder);
onUnmounted(disableRadialBorder);
</script>

<style lang="scss" scoped></style>
