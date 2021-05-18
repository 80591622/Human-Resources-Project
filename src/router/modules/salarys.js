import Layout from '@/layout'

// 工资
export default {
  path: '/salarys',
  component: Layout,
  children: [
    {
      path: '',
      name: 'salarys', // 后续权限会根据name过滤
      component: () => import('@/views/salarys'), // 懒加载
      meta: { title: '工资', icon: 'money' }
    }
  ]
}
