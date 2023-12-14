export default [
  {
    path: '/asset/collect',
    name: 'Asset-Collect',
    component: () => import('@/views/collect/index.vue'),
    meta: { title: '资产领用' }
  },
  {
    path: '/asset/collect/detail',
    name: 'Asset-Collect-Detail',
    component: () => import('@/views/collect/detail.vue'),
    meta: { title: '资产领用详情' }
  },
  {
    path: '/asset/collect/edit',
    name: 'Asset-Collect-Ddit',
    component: () => import('@/views/collect/edit.vue'),
    meta: { title: '编辑资产领用' }
  },
  {
    path: '/asset/collect/add',
    name: 'Asset-Collect-Add',
    component: () => import('@/views/collect/edit.vue'),
    meta: { title: '编辑资产领用' }
  }
]