// 引入路由实例,动态路由
import router, { asyncRoutes } from './router'
// 引入vuex store实例
import store from './store'
// import { Message } from 'element-ui'
// 引入进度条插件
import NProgress from 'nprogress' // progress bar
// 引入进度条css
import 'nprogress/nprogress.css' // progress bar style
// import { getToken } from '@/utils/auth' // get token from cookie
// import getPageTitle from '@/utils/get-page-title'

// NProgress.configure({ showSpinner: false }) // NProgress Configuration

// 定义白名单不受权限控制的页面
const whiteList = ['/login', '/404'] // no redirect whitelist

router.beforeEach(async (to, from, next) => {
  // 有 token
  if (store.getters.token) {
    if (to.path === 'login') {
      next('/')
    } else {
      // 有了用户数据之后再跳转首页
      next()
      /**
       * 调用 Action 方法两个条件
       * 1. 有token
       * 2. 在访问首页之前获取用户信息
       */
      if (!store.getters.name) {
        /**
         * js单线程
         * 1. 异步代码会先放到队列
         * 2. 先执行同步代码
         * 3. 等到所有同步代码执行完=》从队列取出所有异步代码执行
         */
        // 异步=》401出错=》阻塞后续代码的执行
        const perms = await store.dispatch('user/getUserInfo')
        // 上一步获取登录人的基本信息（其中包含权限点的标识数据）
        /**
         * 需求：根据获取的权限点的标识数据过滤动态路由=》用户只能访问指定的页面
         * 1. 获取权限点标识
         * 2. 根据登录人的权限标识数据过滤动态路由
         */
        const canLook = asyncRoutes.filter(route => {
          // menus 中如果包含当前 route 的 name 就留下
          // console.log(route.children[0].name)
          return perms.menus.includes(route.children[0].name)
        })
        // 存储到菜单数据
        store.commit('menus/setMenuList', canLook)
        // console.log('当前登录人权限点数据:', perms, canLook)
        // 动态路由的配置
        router.addRoutes([...canLook, { path: '*', redirect: '/404', hidden: true }])
      }
    }
  } else {
    // 如果没有token
    if (whiteList.indexOf(to.path) > -1) {
      // 如果找到了 表示在在名单里面
      next()
    } else {
      next('/login') // 跳到登录页
    }
  }
  // 关闭进度条
  NProgress.done()
})

router.afterEach(() => {
  //   // finish progress bar
  NProgress.done()
})
