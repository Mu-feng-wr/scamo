export default [
  {
    path: '/asset/change',
    name: 'asset-change',
    component: () => import('@/views/change/index.vue'),
    meta: { title: '资产变更' }
  }
]