export default [
  {
    path: '/member/memberc/order/manage',
    name: 'Member-Memberc-Order-Manage',
    component: () => import('@/views/order/index.vue'),
    meta: { title: '订单管理' }
  }
]