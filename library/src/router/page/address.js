export default [
  {
    path: '/library/address',
    name: 'Library-Address',
    component: () => import('@/views/address/index.vue'),
    meta: { title: '库位' }
  },
  {
    path: '/library/address/add',
    name: 'Library-Address-Add',
    component: () => import('@/views/address/edit.vue'),
    meta: { title: '新增库位' }
  },
  {
    path: '/library/address/edit',
    name: 'Library-Address-Edit',
    component: () => import('@/views/address/edit.vue'),
    meta: { title: '编辑库位' }
  },
  {
    path: '/library/address/detail',
    name: 'Library-Address-Detail',
    component: () => import('@/views/address/detail.vue'),
    meta: { title: '库位详情' }
  }
]