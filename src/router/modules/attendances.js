import Layout from '@/layout'

// 考勤
export default {
  path: '/attendances',
  component: Layout,
  children: [
    {
      path: '',
      name: 'attendances', // 后续权限会根据name过滤
      component: () => import('@/views/attendances'), // 懒加载
      meta: { title: '考勤', icon: 'skill' }
    }
  ]
}
