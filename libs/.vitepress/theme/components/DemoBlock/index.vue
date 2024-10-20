<template>
  <div class="example">
    <Example v-if="language === 'vue'" :path="demoPath" />
    <div v-else>
      <SourceCode><slot name="demo"></slot></SourceCode>
    </div>
    <ElDivider class="m-0" />
    <div class="op-btns">
      <ElTooltip content="复制代码" :show-arrow="false">
        <ElIcon :size="16" class="op-btn" @click="onCopy">
          <CopyDocument />
        </ElIcon>
      </ElTooltip>
      <ElTooltip content="查看源代码" :show-arrow="false">
        <ElIcon :size="16" class="op-btn" @click="toggleSourceVisible()">
          <View />
        </ElIcon>
      </ElTooltip>
    </div>
    <ElCollapseTransition>
      <SourceCode v-show="sourceVisible">
        <slot></slot>
      </SourceCode>
    </ElCollapseTransition>
    <Transition name="el-fade-in-linear">
      <div
        v-show="sourceVisible"
        class="example-float-control"
        @click="toggleSourceVisible(false)"
      >
        <ElIcon :size="16">
          <CaretTop />
        </ElIcon>
        <span>隐藏源代码</span>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import Example from './Example.vue';
import { useClipboard, useToggle } from '@vueuse/core';
import { ElMessage } from 'element-plus';
import SourceCode from './Code.vue';
import { CaretTop, CopyDocument, View } from '@element-plus/icons-vue';
import {
  ElTooltip,
  ElIcon,
  ElCollapseTransition,
  ElDivider,
} from 'element-plus';

const props = withDefaults(
  defineProps<{
    demoPath?: string;
    language?: string;
    codeStr: string;
    src: string;
  }>(),
  {
    language: 'vue',
  }
);

const [sourceVisible, toggleSourceVisible] = useToggle(false);

const { copy, isSupported } = useClipboard({
  source: decodeURIComponent(props.codeStr),
  read: false,
});

// 复制代码
const onCopy = async () => {
  if (!isSupported) {
    ElMessage.error('复制失败');
  }
  try {
    await copy();
    ElMessage.success('已复制');
  } catch (e: any) {
    ElMessage.error(e.message);
  }
};
</script>

<style lang="scss" scoped>
.example {
  margin: 15px 0 30px;
  border: 1px solid var(--border-color);
  border-radius: var(--el-border-radius-base);
  .m-0 {
    margin: 0;
  }
  .op-btns {
    padding: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: 2.5rem;
    .el-icon {
      &:hover {
        color: var(--text-color);
      }
    }

    .op-btn {
      margin: 0 0.5rem;
      cursor: pointer;
      color: var(--text-color-lighter);
      transition: 0.2s;

      &.github a {
        transition: 0.2s;
        color: var(--text-color-lighter);

        &:hover {
          color: var(--text-color);
        }
      }
    }
  }

  &-float-control {
    display: flex;
    align-items: center;
    justify-content: center;
    border-top: 1px solid var(--border-color);
    height: 44px;
    box-sizing: border-box;
    background-color: var(--vp-c-bg);
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    margin-top: -1px;
    color: var(--el-text-color-secondary);
    cursor: pointer;
    position: sticky;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 10;
    span {
      font-size: 14px;
      margin-left: 10px;
    }

    &:hover {
      color: var(--el-color-primary);
    }
  }
}
</style>
