<template>
  <!-- 放置一个图标 -->
  <div>
    <svg-icon :icon-class="isFull ? 'exit-fullscreen' : 'fullscreen'" class="fullscreen" @click="toggleScreen" />
  </div>
</template>

<script>
// 导入全拼语言切换
import screenFull from 'screenfull'
export default {
  name: 'ScreenFull',
  data() {
    return {
      // 是否是全屏状态
      isFull: false
    }
  },
  created () {
    // 监听浏览器是否进入全局状态
    screenFull.on('change', () => {
      if (screenFull.isFullscreen) {
        this.isFull = true
      } else {
        this.isFull = false
      }
    })
  },
  beforeDestroy () {
    // 解绑全屏事件
    screenFull.off('change')
  },
  methods: {
    // 点击开启/关闭全屏
    toggleScreen() {
      /**
       * 1. 导入全屏插件
       * 2. 使用全屏插件开启全屏功能
       */
      // 判断浏览器是否支持全屏
      if (!screenFull.isEnabled) {
        return this.$message.warning('您的浏览器不支持全屏功能')
      }
      // 支持全屏就切换到全屏,不支持就关闭
      screenFull.toggle()
    }
  }
}
</script>

<style lang="scss" scoped>
.fullscreen {
  width: 20px;
  height: 20px;
  color: #fff;
  cursor: pointer;
}
</style>
