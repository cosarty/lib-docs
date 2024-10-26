<template>
  <ElConfigProvider :locale="zhCn">
    <slot name="header"></slot>
    <div v-loading="loading" class="mx-auto max-w-full overflow-hidden bg-white">
      <ElTable v-bind="$attrs" :data="tableData" style="width: 100%" @selection-change="selectChange"
        @sort-change="sortHandle">
        <!-- isSelect:是否显示第一列选择框 -->
        <ElTableColumn v-if="isSelect" type="selection" width="55"></ElTableColumn>
        <!-- showIndex:是否显示索引 -->
        <ElTableColumn v-if="showIndex" :label="indexLabel" width="100px" :align="'center'">
          <template #default="{ $index }">
            {{ $index + 1 + searcherParam.ps * (searcherParam.pn - 1) }}
          </template>
        </ElTableColumn>
        <ElTableColumn v-for="(
            //将父组件传来值解构
              {
                label,
                type,
                prop,
                width,
                fixed,
                align,
                options,
                event,
                sort,
                opTrans,
                tip,
                activeValue,
                inactiveValue,
                hideLine,
              },
              idx
          ) in colums" :key="idx" v-slot="{ row }" :width="width ?? ''" :prop="prop" :label="label"
          :fixed="fixed ?? false" :align="align ?? 'center'" :sortable="sort ? 'custom' : false">
          <template v-if="$slots[prop]">
            <div :class="{
              'hide-line2': hideLine === 2,
              'hide-line1': hideLine === 1,
            }">
              <slot :name="prop" :row="row">{{ row[prop] }}</slot>
            </div>
          </template>
          <template v-else-if="type === 'image'">
            <ElImage :src="row[prop]" fit="fill" lazy preview-teleported :hide-on-click-modal="true"
              :preview-src-list="[row[prop]!]" class="w-[50px] h-[50px] mx-auto !flex items-center">
              <template #placeholder>
                <div class="bg-[#a8a6a6] text-white text-xs h-full flex items-center justify-center">
                  加载中
                </div>
              </template>
            </ElImage>
          </template>
          <template v-else-if="type === 'date'">
            {{ dayjs(row[prop]).format('YYYY-MM-DD HH:mm') }}
          </template>

          <template v-else-if="type === 'select'">
            <ElSelect :model-value="row[prop]" @change="(e: any) => event?.(e, row)">
              <ElOption v-for="(op, k) in options" :key="k" :value="k" :label="op"></ElOption>
            </ElSelect>
          </template>

          <template v-else-if="type === 'tag' && options">
            <ElTag v-if="options[opTrans?.(row[prop]) ?? row[prop]]"
              :type="options[opTrans?.(row[prop]) ?? row[prop]]?.type ?? 'info'">
              {{ options[opTrans?.(row[prop]) ?? row[prop]]?.text ?? '未知' }}
            </ElTag>
          </template>

          <template v-else-if="type === 'tagList'">
            <div class="flex flex-wrap gap-[5px]">
              <ElTag v-for="(text, key) in row[prop]" :key="key">
                {{ opTrans?.(text) ?? text }}
              </ElTag>
            </div>
          </template>
          <template v-else-if="type === 'switch'">
            <!-- switch开关切换 -->
            <ElSwitch :model-value="row[prop]" :active-value="isDef(activeValue) ? activeValue : 0"
              :inactive-value="isDef(inactiveValue) ? inactiveValue : 1" :loading="row.switchLaoding" @change="($event: any) => Object.keys(row).length && event?.($event, row)
                "></ElSwitch>
          </template>
          <template v-else>
            <ElTooltip v-if="row[prop] && tip" effect="dark" :content="row[prop]" placement="top">
              <div :class="{
                'hide-line2': hideLine === 2,
                'hide-line1': hideLine === 1,
              }">
                {{ isDef(row[prop]) ? row[prop] : '-' }}
              </div>
            </ElTooltip>

            <div v-else :class="{
              'hide-line2': hideLine === 2,
              'hide-line1': hideLine === 1,
            }">
              {{ isDef(row[prop]) ? row[prop] : '-' }}
            </div>
          </template>
        </ElTableColumn>

        <!-- action -->
        <!-- fixed="right" -->
        <ElTableColumn v-if="action && action.length" v-slot="{ row }" align="center"
          :width="buttonWidth > 200 ? 200 : buttonWidth" label="操作" fixed="right">
          <div>
            <div class="flex justify-center items-center flex-wrap">
              <template v-for="(
                  { type, title, event, link, confirmTitle, permission }, idx
                ) in action" :key="idx">
                <!--如果permission 不存在直接显示，如果permission存在则判断userInfo的permission
                  是否在permission列表里面 ，如果在就显示  -->
                <template v-if="
                  !permission
                ">
                  <div class="h-[15px] mx-[4px] w-[1px]"></div>
                  <ElPopconfirm v-if="confirmTitle" :key="idx" :title="confirmTitle" confirm-button-text="是"
                    cancel-button-text="否" @confirm="removeHandler(event, row)">
                    <template #reference>
                      <ElButton :size="'default'" :link="link" :type="type ?? 'default'">
                        {{ title }}
                      </ElButton>
                    </template>
                  </ElPopconfirm>

                  <ElButton v-else :size="'default'" :link="link" :type="type ?? 'default'" @click="() => event?.(row)">
                    {{ title }}
                  </ElButton>
                </template>
              </template>
            </div>
          </div>
        </ElTableColumn>
        <ElTableColumn v-else-if="$slots.button" v-slot="{ row }" align="center" fixed="right" label="操作"
          :width="actionWidth">
          <slot name="button" :row="row"></slot>
        </ElTableColumn>
      </ElTable>

      <!-- v-if="total > ps" 底部分页-->
      <div class="flex justify-between mt-5 pl-[30px]">
        <slot v-if="$slots.footer" name="footer"></slot>
        <Pagination class="ml-auto" :total="total" :page-size="searcherParam.ps"
          :hide-on-single-page="!!hideOnSinglePage" @page-change="pageChange" @size-change="sizeChange" />
      </div>
    </div>
  </ElConfigProvider>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import { isDef } from '../../utils/validator'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { computed, onMounted, ref } from 'vue'
import { ElTable, ElImage, ElTableColumn, ElPopconfirm, ElButton, ElSelect, ElOption, ElSwitch, ElTag, ElConfigProvider, ElTooltip } from 'element-plus'
import Pagination from './Pagination.vue'
export type TableColumType = {
  prop: string
  label: string
  isSearch?: boolean
  type?: 'date' | 'default' | 'image' | 'select' | 'tag' | 'switch' | 'tagList'
  sort?: boolean | 'desc' | 'esc'
  align?: 'left' | 'center' | 'right'
  width?: string
  options?: any // 只有当prop 是select的时候才有用
  fixed?: boolean | 'left' | 'right'
  event?: (e: any, row: any) => void // 只有当prop 是select的时候才有用
  labelWidth?: string
  searcherPlaceHolder?: string
  opTrans?: (data: any) => any
  tip?: boolean //是否使用tip
  activeValue?: number | string
  inactiveValue?: number | string
  hideLine?: 1 | 2 // 溢出隐藏
}[]
export type TableActionType = {
  title: string
  type?: 'primary' | 'success' | 'info' | 'warning' | 'danger'
  event?: (row: any) => void
  link?: boolean
  confirmTitle?: string
  permission?: number[]
}[]
const props = withDefaults(
  defineProps<{
    //自定义表单标题，列宽,操作事件(比如:点击方法)
    colums: TableColumType
    //表格操作项:如编辑，删除
    action?: TableActionType
    //获取数据:在onMounted发请求
    request?: (pramData: any) => Promise<any>
    ps?: number
    isSelect?: boolean
    tableData?: any
    requestParam?: Record<string, any>
    showIndex?: boolean
    indexLabel?: string
    actionWidth?: string
    hideOnSinglePage?: boolean
  }>(),
  {
    ps: 10,
    requestParam: () => ({}),
    indexLabel: '序号',
    showIndex: true,
    actionWidth: '200px',
  },
)


const data = ref<any[]>([])

const tableData = computed(() => props.tableData || data.value)
const searcherParam = ref<Record<string, any>>({
  ps: props.ps,
  pn: 1,
})
const loading = ref(false)
const total = ref<number>(0)
const selectValue = ref<any>([])
onMounted(async () => {
  if (!props.request) return
  await request()
})

const selectChange = (value: any) => {
  if (!props.isSelect) return
  selectValue.value = value
}

// 请求 onmounted 使用
const request = async () => {
  if (!props.request) return
  selectValue.value = []
  loading.value = true
    //解构写法:data.value:表格数据
    ;[data.value, total.value] = await props.request(
      //请求表格接口参数:props.requestParam
      Object.assign(searcherParam.value, props.requestParam),
    )
  loading.value = false
}

// 计算action的宽高
const buttonWidth = computed(() => {
  const { action } = props
  if (action && action.length) {
    return (
      [...action].reduce((width: number, btn: any) => {
        return (width += (btn?.title?.length ?? 0) * 15 + 25)
      }, 0) + 70
    )
  }
  return 0
})

//底部分页操作
const pageChange = (count: number) => {
  searcherParam.value.pn = count
  request()
}
const sizeChange = (size: number) => {
  searcherParam.value.ps = size
  request()
}
//

//重置表格数据操作(参数初始化,页数为1)
const reset = async () => {
  searcherParam.value = Object.assign(
    { ps: props.ps, pn: 1 },
    [...Object.keys(searcherParam.value)]
      .filter(k => ['DESC', 'ASC'].includes(searcherParam.value[k]))
      .reduce((p, k) => Object.assign(p, { [k]: searcherParam.value[k] }), {}),
  )

  await request()
}

const removeHandler = async (event: any, raw: any) => {
  // 删除重新加载数据
  const flag = await event(raw)
  if (flag) {
    request()
  }
}

const sortHandle = ({ prop, order }: any) => {
  // 'descending' |'ascending'

  switch (order) {
    case 'descending':
      searcherParam.value[prop] = 'DESC'
      break
    case 'ascending':
      searcherParam.value[prop] = 'ASC'
      break
    default:
      searcherParam.value[prop] = undefined
      break
  }

  request()
}

defineExpose({ request, reset, selectValue })
</script>

<style lang="scss" scoped>
:deep(.el-button + .el-button) {
  margin-left: 0 !important;
}
</style>
