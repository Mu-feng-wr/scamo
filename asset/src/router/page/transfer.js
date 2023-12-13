export default [
  {
    path: '/asset/transfer',
    name: 'asset-transfer',
    component: () => import('@/views/transfer/index.vue'),
    meta: { title: '资产调拨' }
  }
]