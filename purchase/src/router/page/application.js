export default [
  {
    path: '/purchase/application',
    name: 'Purchase-Application',
    component: () => import('@/views/application/index.vue'),
    meta: { title: '申购' }
  },
  {
    path: '/purchase/application/add',
    name: 'Purchase-Application-Add',
    component: () => import('@/views/application/edit.vue'),
    meta: { title: '新增申购' }
  },
  {
    path: '/purchase/application/edit',
    name: 'Purchase-Application-Edit',
    component: () => import('@/views/application/edit.vue'),
    meta: { title: '编辑申购' }
  },
  {
    path: '/purchase/application/detail',
    name: 'Purchase-Application-Detail',
    component: () => import('@/views/application/detail.vue'),
    meta: { title: '申购详情' }
  }
]