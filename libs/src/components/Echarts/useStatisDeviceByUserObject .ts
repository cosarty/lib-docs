import { onMounted } from 'vue'
import { BarECOption, ChartsEvents, chartsOptions } from './useCharts'

export const useStatisDeviceByUserObject = () => {
  // 使用chartsOptions确保所有传入v-charts组件的options数据都是## shallowReactive浅层作用形式，避免大量数据导致性能问题
  const options = chartsOptions<BarECOption>({
    yAxis: {},
    xAxis: {},
    series: [],
  })
  const init = async () => {
    // const xData = []
    // const sData = []
  }

  // 事件
  const selectchanged = (params: ChartsEvents.Events['selectchanged']) => {
    console.log(params, '选中图例了')
  }

  const handleChartClick = (params: ChartsEvents.Events['chartClick']) => {
    console.log(params, '点击了图表')
  }

  onMounted(() => {
    init()
  })
  return {
    options,
    selectchanged,
    handleChartClick,
  }
}
