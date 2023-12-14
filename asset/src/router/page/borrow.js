export default [
  {
    path: '/asset/borrow',
    name: 'Asset-Borrow',
    component: () => import('@/views/borrow/index.vue'),
    meta: { title: '资产借用' }
  },
  {
    path: '/asset/borrow/edit',
    name: 'Asset-Borrow-Edit',
    component: () => import('@/views/borrow/edit.vue'),
    meta: { title: '编辑资产借用' }
  },
  {
    path: '/asset/borrow/add',
    name: 'Asset-Borrow-Add',
    component: () => import('@/views/borrow/edit.vue'),
    meta: { title: '新增资产借用' }
  },
  {
    path: '/asset/borrow/detail',
    name: 'Asset-Borrow-Detail',
    component: () => import('@/views/borrow/detail.vue'),
    meta: { title: '资产借用详情' }
  }
]