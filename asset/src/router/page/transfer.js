export default [
  {
    path: '/asset/transfer',
    name: 'Asset-Transfer',
    component: () => import('@/views/transfer/index.vue'),
    meta: { title: '资产调拨' }
  }
]