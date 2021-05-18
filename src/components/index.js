/**
 * vue插件
 */
// 导入组件
import PageTools from './PageTools'
// 导入导出Excel
import UploadExcel from './UploadExcel'
import Depets from './Depets'
import ElDtree from './ElDtree'
// 头像上传
import UploadPhoto from './UploadPhoto/'
// console.log('name:', UploadExcel.name)
// 全屏切换
import ScreenFull from './ScreenFull'
// 语言翻译
import Lang from './Lang'
// 把需要全局注册的组件放入数组
const components = [PageTools, UploadExcel, Depets, ElDtree, UploadPhoto, ScreenFull, Lang]

const plugins = {
  install (Vue) {
    // 注册全局组件、方法、指令、过滤器
    // Vue.component('PageTools', PageTools)
    components.forEach(cp => {
      Vue.component(cp.name, cp)
    })
  }
}

export default plugins
