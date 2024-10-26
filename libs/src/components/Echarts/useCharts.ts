import { ChartType } from './type'
import * as echarts from 'echarts/core'
import {
  ShallowRef,
  Ref,
  shallowRef,
  useAttrs,
  onBeforeUnmount,
  shallowReactive,
} from 'vue'

import {
  TitleComponent,
  LegendComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  VisualMapComponent,
  DataZoomComponent,
  ToolboxComponent,
  GeoComponent,
} from 'echarts/components'

import {
  BarChart,
  LineChart,
  PieChart,
  GaugeChart,
  MapChart,
} from 'echarts/charts'
import { LabelLayout, UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
import { useResizeObserver } from '@vueuse/core'
interface ChartHookOption {
  type: Ref<ChartType>
  el: ShallowRef<HTMLElement>
}

/**
 *  视口变化时echart图表自适应调整
 */
class ChartsResize {
  #charts = new Set<echarts.ECharts>() // 缓存已经创建的图表实例
  // #timeId: NodeJS.Timeout | null = null
  constructor() {
    typeof window !== 'undefined' &&
      window.addEventListener('resize', this.handleResize.bind(this)) // 视口变化时调整图表
  }
  getCharts() {
    return [...this.#charts]
  }
  handleResize() {
    this.#charts.forEach(chart => {
      chart.resize({
        animation: {
          duration: 300,
          easing: 'quadraticIn',
        },
      })
    })
    // 这块是防抖
    // if (this.#timeId) {
    //   clearTimeout(this.#timeId)
    // }

    // this.#timeId = setTimeout(() => {
    //   this.#charts.forEach(chart => {
    //     chart.resize()
    //   })
    // }, 500)
  }
  add(chart: echarts.ECharts) {
    this.#charts.add(chart)
  }
  remove(chart: echarts.ECharts) {
    this.#charts.delete(chart)
  }
  removeListener() {
    typeof window !== 'undefined' &&
      window.removeEventListener('resize', this.handleResize)
  }
}

export const chartsResize = new ChartsResize()

export const useCharts = ({ el }: ChartHookOption) => {
  echarts.use([
    MapChart,
    BarChart,
    LineChart,
    BarChart,
    PieChart,
    GaugeChart,
    ToolboxComponent,
    TitleComponent,
    LegendComponent,
    TooltipComponent,
    GridComponent,
    DatasetComponent,
    TransformComponent,
    LabelLayout,
    UniversalTransition,
    CanvasRenderer,
    VisualMapComponent,
    DataZoomComponent,
    GeoComponent,
  ])
  const charts = shallowRef<echarts.ECharts>()

  const setOptions = (opt: echarts.EChartsCoreOption) => {
    if (charts.value) charts.value.setOption(opt)
  }
  const initChart = async () => {
    charts.value = echarts.init(el.value)
    chartsResize.add(charts.value) // 将图表实例添加到缓存中
    initEvent() // 添加事件支持
    // charts.value?.showLoading({
    //   text: '数据加载中',
    //   textColor: '#fff',
    //   effect: 'whirling',
    //   maskColor: 'rgba(255 255 255 / 10%)',
    // })
  }

  // 取消加载
  // const done = () => {
  //   chart?.hideLoading();
  // };

  /**
   * 初始化事件,按需绑定事件
   */
  const attrs = useAttrs()
  const initEvent = () => {
    Object.keys(attrs).forEach(attrKey => {
      if (/^on/.test(attrKey)) {
        const cb = attrs[attrKey]
        attrKey = attrKey.replace(/^on(Chart)?/, '')
        attrKey = `${attrKey[0].toLocaleLowerCase()}${attrKey.substring(1)}`
        typeof cb === 'function' && charts.value?.on(attrKey, cb as () => void)
      }
    })
  }

  useResizeObserver(el, () => {
    if (charts.value) {
      charts.value.resize()
    }
  })

  onBeforeUnmount(() => {
    if (charts.value) {
      charts.value.dispose() // 销毁实例
      chartsResize.remove(charts.value) // 移除缓存
    }
  })

  return {
    charts,
    setOptions,
    initChart,
    initEvent,
  }
}

export const chartsOptions = <T extends echarts.EChartsCoreOption>(option: T) =>
  shallowReactive<T>(option)

export * from './type.d'
