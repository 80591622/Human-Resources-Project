import Vue from 'vue'

// 导入重置默认样式的css
import 'normalize.css/normalize.css' // A modern alternative to CSS resets

// 导入elment组件库
import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n
if (process.env.NODE_ENV === 'development') {
  // import不能写在语句块中
  require('element-ui/lib/theme-chalk/index.css')
}

// 导入全局的公共样式
import '@/styles/index.scss' // global css

// 导入全局混用方法
import checkPonints from '@/mixin/checkpoints'
// 使用全局混用组件
Vue.mixin(checkPonints)

import App from './App'
import store from './store' // 导入vuex
import router from './router'

import '@/icons' // icon 导入的svg图标
import '@/permission' // permission control 权限控制js

// 导入全屏语言插件
import i18n from '@/lang'

// 导入自己的插件
import Plugins from '@/utils/plugins'
// 导入插件对象
import Components from './components'
Vue.use(Components)
Vue.use(Plugins)

// 导入自定义指令
import * as dicts from '@/directives'
// console.log('获取所有指令对象:', dicts)
// 遍历对象注册的所有指令
Object.keys(dicts).forEach(dname => {
  // Vue.directive 使用自定义指令
  Vue.directive(dname, dicts[dname])
})

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
