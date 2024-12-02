<template>
  <div>
    <div>
      <div
        class="font-bold text-base flex items-center bg-no-repeat bg-[100%_100%] cursor-pointer select-none"
        @click="open = !open"
      >
        <span>{{ title }}</span>
      </div>
      <div
        class="grid grid-rows-[0fr] duration-300 transition-all"
        :class="open && 'grid-rows-[1fr]'"
      >
        <div class="overflow-hidden flex flex-col gap-y-5">
          <slot></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineProps<{ title: string }>()
const open = ref(false)
</script>

<style scoped lang="sass"></style>

