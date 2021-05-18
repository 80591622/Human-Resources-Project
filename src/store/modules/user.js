import { getToken, setToken, removeToken } from '@/utils/auth.js'
// 导入登陆接口
import { login, getUserInfo, getUserDetailById } from '@/api/user'
import { resetRouter } from '@/router'
export default {
  namespaced: true,
  state: {
    // 定义token
    token: getToken() || null,
    // 设置用户信息
    userInfo: {}
  },
  mutations: {
    // 存储token
    setToken (state, token) {
      state.token = token
      // 持久化存储
      setToken(token)
    },
    // 删除token
    delToken (state) {
      state.token = null
      removeToken()
    },
    // 设置用户信息
    setUserInfo (state, userInfo) {
      state.userInfo = userInfo
    },
    // 删除用户信息
    delUserInfo (state) {
      state.userInfo = {}
    }
  },
  actions: {
    // 退出登录:清除当前token和登录信息
    logout (ctx) {
      // 删除token
      ctx.commit('delToken')
      // 清除登录信息
      ctx.commit('delUserInfo')
      // 1. 重置路由清空菜单数据
      resetRouter()
      // 2. 重置菜单数据
      // 子模块如果需要调用兄弟模块的 mutations方法,需要在第三个参数加上 {root:true}
      ctx.commit('menus/setMenuList', [], { root: true })
    },
    // 登陆token
    async userLogin (ctx, loginForm) {
      const res = await login(loginForm)
      ctx.commit('setToken', res)
    },
    // 获取用户资料
    async getUserInfo (ctx) {
      // 获取用户信息
      const result = await getUserInfo()
      // console.log(result)
      // 获取用户头像,调用 API 传递用户 id 参数
      const baseInfo = await getUserDetailById(result.userId)
      // 用户信息和用户头像合并存储到 userInfo 中
      ctx.commit('setUserInfo', { ...result, ...baseInfo })
      // 将个人权限数据返回
      return result.roles
    }

  }
}

