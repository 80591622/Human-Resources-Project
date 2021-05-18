// 导入 store
import store from '@/store'
/**
 * mixin 全局混入
 * 定义的组件对象选项,会被混用
 */
export default {
  data () {
    return {

    }
  },
  methods: {
    /**
     * 1. 获取登录人所有权限点的数据
     * 2. 匹配有无权限点
     * @perams code 是某个权限点标识
     */
    checkPonints (code) {
      // 获取用户对象 => roles{menus控制访问权限,points控制访问功能}   =>
      const { userInfo } = store.state.user
      // console.log(userInfo)
      // 如果 userInfo 中的
      if (userInfo.roles?.points && userInfo.roles.points.length) {
        // 如果有权限点则返回权限点
        return userInfo.roles.points.includes(code)
      }
      // 没有权限点数据则返回false
      return false
    }
  }
}
