import { constantRoutes } from '@/router'
export default {
  // 避免冲突命名空间
  namespaced: true,
  // 存数据
  state: {
    // 菜单数据(静态路由+动态路由)
    menuList: []
  },
  // 修改数据
  mutations: {
    setMenuList (state, asyncRoutes) {
      state.menuList = [...constantRoutes, ...asyncRoutes]
    }

  }
}
