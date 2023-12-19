export default [
  {
    path: '/purchase/shipment',
    name: 'Purchase-Shipment',
    component: () => import('@/views/shipment/index.vue'),
    meta: { title: '发货' }
  },
  {
    path: '/purchase/shipment/add',
    name: 'Purchase-Shipment-Add',
    component: () => import('@/views/shipment/edit.vue'),
    meta: { title: '新增发货' }
  },
  {
    path: '/purchase/shipment/edit',
    name: 'Purchase-Shipment-Edit',
    component: () => import('@/views/shipment/edit.vue'),
    meta: { title: '编辑发货' }
  },
  {
    path: '/purchase/detail',
    name: 'Purchase-Shipment-Detail',
    component: () => import('@/views/shipment/detail.vue'),
    meta: { title: '发货详情' }
  }
]