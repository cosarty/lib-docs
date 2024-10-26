<template>
<ElConfigProvider :locale="zhCn">
  <ElDialog v-model="visible" :title="title" :width="width" :class="dialogClass || ''" @closed="emit('close')">
    <div>
      <slot></slot>
    </div>
    <template #footer>
      <span v-if="!$slots.footer" class="dialog-footer">
        <ElButton v-if="showCancel" @click="cancleHandler">
          {{ cancelText || '关闭' }}
        </ElButton>
        <ElButton v-if="showConfirm" v-loading="loading" type="primary" @click="confirmHandler">
          {{ confirmText || '确认' }}
        </ElButton>
      </span>
      <div v-else v-loading="loading">
        <slot name="footer"></slot>
      </div>
    </template>
  </ElDialog>
</ElConfigProvider>
</template>

<script lang="ts" setup>
import { ElMessage, ElConfigProvider, ElButton, ElDialog } from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { ref } from 'vue'
export interface DialogProps {
  confirmText?: string
  cancelText?: string
  showConfirm?: boolean
  showCancel?: boolean
  title: string
  width?: string
  confirmCallBack?: (vnode?: any) => Promise<any> | any
  dialogClass?: string
}

const emit = defineEmits<{
  (e: 'close'): void
}>()

const loading = ref(false)

const props = withDefaults(defineProps<DialogProps>(), {
  confirmText: '确认',
  cancelText: '取消',
  showConfirm: true,
  showCancel: true,
  width: '30%',
  dialogClass: '',
})
const visible = ref(true)

const cancleHandler = () => {
  visible.value = false
}

// 确认的回调
const confirmHandler = async () => {
  try {
    loading.value = true
    const flag = await props.confirmCallBack?.()
    if (flag === false) return
    visible.value = false
  } catch (err: any) {
    if (err instanceof Error) {
      err.message && ElMessage.error(err.message)
    }
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped></style>
