import Layout from '@/layout'

// 权限管理
export default {
  path: '/permissions',
  component: Layout,
  children: [
    {
      path: '',
      name: 'permissions', // 后续权限会根据name过滤
      component: () => import('@/views/permission'), // 懒加载
      meta: { title: '权限管理', icon: 'lock' }
    }
  ]
}
