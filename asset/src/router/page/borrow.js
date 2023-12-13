export default [
  {
    path: '/asset/borrow',
    name: 'asset-borrow',
    component: () => import('@/views/borrow/index.vue'),
    meta: { title: '资产借用' }
  },
  {
    path: '/asset/borrow/edit',
    name: 'asset-borrow-edit',
    component: () => import('@/views/borrow/edit.vue'),
    meta: { title: '编辑资产借用' }
  },
  {
    path: '/asset/borrow/edit',
    name: 'asset-borrow-edit',
    component: () => import('@/views/borrow/edit.vue'),
    meta: { title: '新增资产借用' }
  },
  {
    path: '/asset/borrow/detail',
    name: 'asset-borrow-detail',
    component: () => import('@/views/borrow/detail.vue'),
    meta: { title: '资产借用详情' }
  }
]