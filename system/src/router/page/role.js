export default [
  {
    path: '/system/role',
    name: 'System-Role',
    component: () => import('@/views/role/index.vue'),
    meta: { title: '角色' }
  },
  {
    path: '/system/role/add',
    name: 'System-Role-Add',
    component: () => import('@/views/role/edit.vue'),
    meta: { title: '新增角色' }
  },
  {
    path: '/system/role/edit',
    name: 'System-Role-Edit',
    component: () => import('@/views/role/edit.vue'),
    meta: { title: '编辑角色' }
  },
  {
    path: '/system/role/detail',
    name: 'System-Role-Detail',
    component: () => import('@/views/role/detail.vue'),
    meta: { title: '角色详情' }
  }
]