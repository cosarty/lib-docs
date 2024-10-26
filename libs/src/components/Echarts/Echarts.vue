<template>
  <div ref="chartRef" class="w-full h-full min-h-[300px]"></div>
</template>
<script lang="ts" setup name="Echarts">
import * as echarts from 'echarts/core'
import { useCharts, ChartType, ChartsEvents } from './useCharts'
import { onMounted, shallowRef, toRefs, watch } from 'vue';

interface EventEmitsType<T extends ChartsEvents.EventType> {
  (e: `${T}`, event: ChartsEvents.Events[T]): void
}

const props = withDefaults(
  defineProps<{ type?: ChartType; options: echarts.EChartsCoreOption }>(),
  { type: 'line', options: () => ({}) },
)

defineEmits<EventEmitsType<ChartsEvents.EventType>>()

const { type, options } = toRefs(props)
const chartRef = shallowRef()
const { charts, setOptions, initChart } = useCharts({ type, el: chartRef })

onMounted(async () => {
  await initChart()

  setOptions(options.value)
})
watch(
  options,
  async () => {
    charts.value?.dispose()
    await initChart()
    setOptions(options.value)
  },
  {
    deep: true,
  },
)
defineExpose({
  $charts: charts,
})
</script>
