export default [
  {
    path: '/asset/receipt',
    name: 'Asset-Receipt',
    component: () => import('@/views/receipt/index.vue'),
    meta: { title: '资产入库' }
  },
  {
    path: '/asset/receipt/detail',
    name: 'Asset-Receipt-Detail',
    component: () => import('@/views/receipt/detail.vue'),
    meta: { title: '资产入库详情' }
  },
  {
    path: '/asset/receipt/add',
    name: 'Asset-Receipt-Add',
    component: () => import('@/views/receipt/edit.vue'),
    meta: { title: '新增资产入库' }
  },
  {
    path: '/asset/receipt/edit',
    name: 'Asset-Receipt-Edit',
    component: () => import('@/views/receipt/edit.vue'),
    meta: { title: '编辑资产入库' }
  }
]