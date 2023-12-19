export default [
  {
    path: '/purchase/reject',
    name: 'Purchase-Reject',
    component: () => import('@/views/reject/index.vue'),
    meta: { title: '退货' }
  },
  {
    path: '/purchase/reject/add',
    name: 'Purchase-Reject-Add',
    component: () => import('@/views/reject/edit.vue'),
    meta: { title: '新增退货' }
  },
  {
    path: '/purchase/reject/edit',
    name: 'Purchase-Reject-Edit',
    component: () => import('@/views/reject/edit.vue'),
    meta: { title: '编辑退货' }
  },
  {
    path: '/purchase/reject/detail',
    name: 'Purchase-Reject-Detail',
    component: () => import('@/views/reject/detail.vue'),
    meta: { title: '退货详情' }
  }
]