<template>
  <div class="px-[30px] ">
    <!-- hide-on-single-page -->
    <ElPagination v-model:current-page="pageCount" background layout="total,sizes, prev, pager, next,jumper"
      :total="total" :page-size="pageSize" jumper :page-sizes="[10, 20, 30]" :hide-on-single-page="hideOnSinglePage"
      @current-change="pageChange" @next-click="nexChange" @prev-click="prevChange" @size-change="handleSizeChange" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { ElPagination } from 'element-plus'
const pageCount = ref<number>(1)
withDefaults(
  defineProps<{
    pageSize?: number
    total: number
    hideOnSinglePage: boolean
  }>(),
  {
    pageSize: 10,
    hideOnSinglePage: false,
  },
)

const emit = defineEmits<{
  (e: 'pageChange', pageCount: number): void
  (e: 'sizeChange', pageCount: number): void
}>()
const pageChange = (e: any) => {
  // console.log('e: ', e)
  pageCount.value = e
}
const prevChange = (e: any) => {
  pageCount.value = e - 1
}
const nexChange = (e: any) => {
  pageCount.value = e + 1
}

const handleSizeChange = (size: number) => {
  emit('sizeChange', size)
  emit('pageChange', 1)
}

watch(pageCount, count => {
  emit('pageChange', count)
})
</script>

<style scoped lang="scss"></style>
