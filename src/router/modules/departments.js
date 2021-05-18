import Layout from '@/layout'

// 组织架构
export default {
  path: '/departments',
  component: Layout,
  children: [
    {
      path: '',
      name: 'departments', // 后续权限会根据name过滤
      component: () => import('@/views/departments'), // 懒加载
      meta: { title: '组织架构', icon: 'tree' }
    }
  ]
}
