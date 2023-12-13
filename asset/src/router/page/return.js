export default [
  {
    path: '/asset/return',
    name: 'asset-return',
    component: () => import('@/views/return/index.vue'),
    meta: { title: '资产归还' }
  }
]