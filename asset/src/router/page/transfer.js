export default [
  {
    path: '/asset/transfer',
    name: 'Asset-Transfer',
    component: () => import('@/views/transfer/index.vue'),
    meta: { title: '资产调拨' }
  },
  {
    path: '/asset/transfer/edit',
    name: 'Asset-Transfer-Edit',
    component: () => import('@/views/transfer/edit.vue'),
    meta: { title: '编辑资产调拨' }
  },
  {
    path: '/asset/transfer/add',
    name: 'Asset-Transfer-Add',
    component: () => import('@/views/transfer/edit.vue'),
    meta: { title: '新增资产调拨' }
  },
  {
    path: '/asset/transfer/detail',
    name: 'Asset-Transfer-Detail',
    component: () => import('@/views/transfer/detail.vue'),
    meta: { title: '资产调拨详情' }
  }
]