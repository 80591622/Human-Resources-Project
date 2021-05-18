import Layout from '@/layout'

// 审批
export default {
  path: '/approvals',
  component: Layout,
  children: [
    {
      path: '',
      name: 'approvals', // 后续权限会根据name过滤
      component: () => import('@/views/approvals'), // 懒加载
      meta: { title: '审批', icon: 'tree-table' }
    }
    // 审批的其它页面。。。
  ]
}
