export default [
  {
    path: '/purchase/purchase',
    name: 'Purchase-Purchase',
    component: () => import('@/views/purchase/index.vue'),
    meta: { title: '采购' }
  },
  {
    path: '/purchase/purchase/add',
    name: 'Purchase-Purchase-Add',
    component: () => import('@/views/purchase/edit.vue'),
    meta: { title: '新增采购' }
  },
  {
    path: '/purchase/purchase/edit',
    name: 'Purchase-Purchase-Edit',
    component: () => import('@/views/purchase/edit.vue'),
    meta: { title: '编辑采购' }
  },
  {
    path: '/purchase/purchase/detail',
    name: 'Purchase-Purchase-Detail',
    component: () => import('@/views/purchase/detail.vue'),
    meta: { title: '采购详情' }
  }
]