export default [
  {
    path: '/portface/supplier',
    name: 'Portface-Supplier',
    component: () => import('@/views/supplier/index.vue'),
    meta: { title: '供应商' }
  },
  {
    path: '/portface/supplier/add',
    name: 'Portface-Supplier-Add',
    component: () => import('@/views/supplier/edit.vue'),
    meta: { title: '新增供应商' }
  },
  {
    path: '/portface/supplier/edit',
    name: 'Portface-Supplier-Edit',
    component: () => import('@/views/supplier/edit.vue'),
    meta: { title: '编辑供应商' }
  },
  {
    path: '/portface/supplier/detail',
    name: 'Portface-Supplier-Detail',
    component: () => import('@/views/supplier/detail.vue'),
    meta: { title: '供应商详情' }
  }
]