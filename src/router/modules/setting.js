import Layout from '@/layout'

// 公司设置
export default {
  path: '/setting',
  component: Layout,
  children: [
    {
      path: '',
      name: 'settings', // 后续权限会根据name过滤
      component: () => import('@/views/setting'), // 懒加载
      meta: { title: '公司设置', icon: 'setting' }
    }
  ]
}
