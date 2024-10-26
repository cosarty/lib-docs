<template>
<div>
  <ElButton @click="showDialog">显示弹窗</ElButton>
</div>
</template>

<script setup lang="tsx">
import useDialogComponent from './useDialogComponent';
import { ElButton } from 'element-plus'

const AddDialog = useDialogComponent(<div>我是弹窗</div>)

const showDialog = () => {
  AddDialog({
    title: '测试弹窗',
    width: '500px',
    confirmText: '提交',
    props: {},
    async confirmCallBack(exposed) {}
  })
}

</script>

<style scoped lang="scss"></style>
