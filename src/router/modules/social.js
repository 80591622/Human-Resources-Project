import Layout from '@/layout'

// 社保
export default {
  path: '/social',
  component: Layout,
  children: [
    {
      path: '',
      name: 'social_securitys', // 后续权限会根据name过滤
      component: () => import('@/views/social'), // 懒加载
      meta: { title: '社保', icon: 'table' }
    }
  ]
}
