<template>
  <div class="px-[3px]">
    <div class="flex items-center space-x-[20px] p-[15px] bg-white rounded-md mb-[18px]">
      <div class="w-[200px]">
        <ElInput v-model="formQuery.title" size="large" placeholder="请输入文章标题" clearable @clear="tableRef?.request()">
        </ElInput>
      </div>
      <ElButton type="primary" size="large" @click="tableRef?.request()">
        搜索
      </ElButton>

    </div>
    <CustomTable ref="tableRef" :colums="colum" :action="timingAction" :request="getData" :request-param="formQuery">
      <template #publish_time="{ row }">
        {{ dayjs(row.publish_time).format('YYYY-MM-DD HH:mm') }}
      </template>
    </CustomTable>
  </div>
</template>

<script setup lang="ts" name="article">
import dayjs from 'dayjs'
import { ElButton, ElInput } from 'element-plus'
import CustomTable, {
  type TableActionType,
  type TableColumType,
} from './GlobalTable.vue'
import { ElMessage } from 'element-plus'
import { ref } from 'vue';

const formQuery = ref({
  title: '',
})
const tableRef = ref<InstanceType<typeof CustomTable>>()


const timingAction: TableActionType = [
  {
    type: 'primary',
    title: '编辑',
    link: true,
    event(row: any) {
    },
  },

  {
    type: 'danger',
    title: '删除',
    confirmTitle: '确认删除',
    link: true,
    async event(row: any) {
      ElMessage.success('删除成功')
      return true
    },
  },
]

const colum: TableColumType = [
  { prop: 'title', label: '标题', width: '200px', hideLine: 2 },
  { prop: 'subtitle', label: '子标题', width: '200px', tip: true, hideLine: 2 },
  { prop: 'cover_image', label: '文章封面图', type: 'image' },
  { prop: 'publish_time', label: '发布时间' },
  {
    prop: 'is_hide',
    label: '上线',
    type: 'switch',
    async event(e: 0 | 1, row: any) {
      row.switchLaoding = true

      row.switchLaoding = false
      row.is_hide = e
      ElMessage.success(row.is_hide ? '下线成功' : '上线成功')
    },
  },
]
const getData = async (param: any) => {
  return [
    [
      {
        title: '测试',
        subtitle: '测试',
        publish_time: new Date().getTime(),
        is_hide: 0
      }
    ], 1]
} 
</script>

<style scoped lang="scss"></style>
