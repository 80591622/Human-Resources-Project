import Layout from '@/layout'

// Layout组件中包含
export default {
  path: '/employees',
  // 公共组件
  component: Layout,
  children: [
    {
      // 路由规则name别名
      name: 'employees',
      // 对应直接渲染的组件
      path: '',
      // 路由懒加载
      component: () => import('@/views/employees'),
      // 元信息
      meta: {
        // 菜单标题
        title: '员工管理',
        // 菜单图标
        icon: 'people'
      }
    },
    // 员工详情
    {
      path: '/employees/detail/:id',
      component: () => import('@/views/employees/detail'),
      hidden: true, // 不在左侧菜单显示
      meta: {
        title: '员工详情'
      }
    }
  ]
}
