export default [
  {
    path: '/portface/contract',
    name: 'Portface-Contract',
    component: () => import('@/views/contract/index.vue'),
    meta: { title: '合同' }
  },
  {
    path: '/portface/contract/add',
    name: 'Portface-Contract-Add',
    component: () => import('@/views/contract/edit.vue'),
    meta: { title: '新增合同' }
  },
  {
    path: '/portface/contract/edit',
    name: 'Portface-Contract-Edit',
    component: () => import('@/views/contract/edit.vue'),
    meta: { title: '编辑合同' }
  },
  {
    path: '/portface/contract/detail',
    name: 'Portface-Contract-detail',
    component: () => import('@/views/contract/detail.vue'),
    meta: { title: '合同查看' }
  }
]