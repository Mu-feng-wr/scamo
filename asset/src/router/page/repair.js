export default [
  {
    path: '/asset/repair',
    name: 'asset-repair',
    component: () => import('@/views/repair/index.vue'),
    meta: { title: '资产维修' }
  }
]