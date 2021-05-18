import Vue from 'vue' // 引入Vue
import VueI18n from 'vue-i18n' // 引入国际化的插件包
// 导入element组件翻译需要的文件
import locale from 'element-ui/lib/locale'
import elementEN from 'element-ui/lib/locale/lang/en' // 引入饿了么的英文包
import elementZH from 'element-ui/lib/locale/lang/zh-CN' // 引入饿了么的中文包
// 导入页面相关语言包
import selfEN from './langPag/en'
import selfZH from './langPag/zh'

import ck from 'js-cookie'

// 全局注册国际化包
Vue.use(VueI18n)

// 创建国际化插件的实例
const i18n = new VueI18n({
  // 指定系统的语言： 'zh' 代表中文 | 'en' 代表英文 =>读取指定语言的语言包
  // 先读取cookie中有没有存储切换的语言=》已经存储的值优先级最高
  locale: ck.get('hr-lang') || 'zh',
  // 配置语言包
  messages: {
    zh: {
      ...elementZH,
      ...selfZH
    },
    en: {
      ...elementEN,
      ...selfEN
    }
  }
})

// 配置elementUI 语言转换关系(必须)
locale.i18n((key, value) => i18n.t(key, value))

// 导出多语实例
export default i18n
