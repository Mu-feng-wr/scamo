export default [
  {
    path: '/asset/receipt',
    name: 'asset-receipt',
    component: () => import('@/views/receipt/index.vue'),
    meta: { title: '资产入库' }
  },
  {
    path: '/asset/receipt/detail',
    name: 'asset-receipt-detail',
    component: () => import('@/views/receipt/detail.vue'),
    meta: { title: '资产入库详情' }
  },
  {
    path: '/asset/receipt/add',
    name: 'asset-receipt-add',
    component: () => import('@/views/receipt/edit.vue'),
    meta: { title: '新增资产入库' }
  },
  {
    path: '/asset/receipt/edit',
    name: 'asset-receipt-edit',
    component: () => import('@/views/receipt/edit.vue'),
    meta: { title: '编辑资产入库' }
  }
]