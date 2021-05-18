<template>
  <el-dropdown trigger="hover" @command="changeLanguage">
    <!-- 默认显示内容 -->
    <div>
      <svg-icon style="color: #fff; font-size: 20px" icon-class="language" />
    </div>
    <!-- 下拉菜单内容 -->
    <el-dropdown-menu slot="dropdown">
      <!-- disabled判断避免重复点击 -->
      <el-dropdown-item command="zh" :disabled="'zh' === $i18n.locale">
        中文
      </el-dropdown-item>
      <el-dropdown-item command="en" :disabled="'en' === $i18n.locale">
        en
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import cookie from 'js-cookie'
export default {
  name: 'Lang',
  methods: {
    // 切换语言
    changeLanguage (lang) {
      // console.log(this.$i18n.locale)
      this.$i18n.locale = lang
      // 本地持久化
      // js-cookie设置过期时间：1. 默认天为单位 2. 可以传递日期对象（未来时间）
      // 两分钟后过期：new Date(Date.now() + 2 * 60*1000)=》未来两分钟后的时间对象
      // 两小时候过期
      const expires = new Date(Date.now() + 8 * 60 * 60 * 1000)
      cookie.set('hr-lang', lang, { expires })
      this.$message.success(`切换成：${lang}语言成功！`)
      // console.log('获取commang绑定的值：', lang)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
