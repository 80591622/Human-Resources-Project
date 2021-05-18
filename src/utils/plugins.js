/**
 * vue插件封装
 */
// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
import * as echarts from 'echarts/core'
// 引入柱状图图表，图表后缀都为 Chart
import {
  RadarChart
} from 'echarts/charts'
// 引入提示框，标题，直角坐标系组件，组件后缀都为 Component
import {
  TitleComponent,
  TooltipComponent,
  GridComponent
} from 'echarts/components'
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import {
  CanvasRenderer
} from 'echarts/renderers'

// 注册必须的组件
echarts.use(
  [TitleComponent, TooltipComponent, GridComponent, RadarChart, CanvasRenderer]
)

/**
 * 延迟代码执行
 * @param {*} time 毫秒
 * @returns
 */
const $sleep = (time) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, time)
  })
}

export default {
  // Vue.use会调用install方法传入Vue对象
  install (Vue) {
    Vue.prototype.$sleep = $sleep
    // 挂载echarts方法
    Vue.prototype.echarts = echarts
  }
}
