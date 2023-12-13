export default [
  {
    path: '/asset/collect',
    name: 'asset-collect',
    component: () => import('@/views/collect/index.vue'),
    meta: { title: '资产领用' }
  },
  {
    path: '/asset/collect/detail',
    name: 'asset-collect-detail',
    component: () => import('@/views/collect/detail.vue'),
    meta: { title: '资产领用详情' }
  },
  {
    path: '/asset/collect/edit',
    name: 'asset-collect-edit',
    component: () => import('@/views/collect/edit.vue'),
    meta: { title: '编辑资产领用' }
  },
  {
    path: '/asset/collect/add',
    name: 'asset-collect-add',
    component: () => import('@/views/collect/edit.vue'),
    meta: { title: '编辑资产领用' }
  }
]