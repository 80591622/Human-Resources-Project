<template>
  <div>
    <el-button class="sideBtn" type="success" @click="loop">切换数据</el-button>
    <div ref="radar" class="radar-echart"></div>
  </div>
</template>

<script>
const option = {
  // 数据指示器
  tooltip: {},
  radar: {
    indicator: [
      { name: '工作效率', max: 100 },
      { name: '考勤', max: 100 },
      { name: '积极性', max: 100 },
      { name: '帮助同事', max: 100 },
      { name: '自助学习', max: 100 },
      { name: '正确率', max: 100 }
    ]
  },
  series: [{
    type: 'radar',
    data: [
      // 此处为假数据,正式工作调接口
    ]
  }]

}
export default {
  name: 'Radar',
  mounted () {
    this.radarChart()
  },
  // 在销毁生命周期销毁延时器
  beforeDestroy() {
    clearInterval(this.timer)
  },
  methods: {
    // 动态切换数据
    loop() {
      // 给延时器加标识并清除延时器
      this.timer = setInterval(this.change, 1000)
    },
    // 切换数据方法
    change() {
      // 造假数据
      const data = []
      // 生成假数据
      for (let i = 0; i < 3; i++) {
        const item = { name: `李${i}`, value: [] }
        // 生成value数据
        for (let j = 0; j < 6; j++) {
          item.value.push(Math.floor(Math.random() * 100 + 1))
        }
        data.push(item)
      }
      // 添加新数据
      option.series[0].data = data
      // 重新渲染假数据
      this.echart.setOption(option)
      // console.log(data)
    },
    // 绘制雷达图
    radarChart() {
      // 基于准备好的dom ,实例化echarts
      this.echart = this.echarts.init(this.$refs.radar)
      // 向配置项data中添加默认数据
      option.series[0].data = [{
        value: [20, 60, 50, 70, 50, 80],
        name: '小明'
      },
      {
        value: [50, 40, 80, 60, 40, 100],
        name: '小李'
      }]
      // 绘制图表
      this.echart.setOption(option)
    }

  }
}
</script>

<style lang="scss" scoped>
.radar-echart {
  width: 100%;
  height: 400px;
}

</style>
