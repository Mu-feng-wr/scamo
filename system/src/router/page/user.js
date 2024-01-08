export default [
  {
    path: '/system/user',
    name: 'System-User',
    component: () => import('@/views/user/index.vue'),
    meta: { title: '用户' }
  },
  {
    path: '/system/user/add',
    name: 'System-User-Add',
    component: () => import('@/views/user/edit.vue'),
    meta: { title: '新增用户' }
  },
  {
    path: '/system/user/edit',
    name: 'System-User-Edit',
    component: () => import('@/views/user/edit.vue'),
    meta: { title: '编辑用户' }
  },
  {
    path: '/system/user/detail',
    name: 'System-User-Detail',
    component: () => import('@/views/user/detail.vue'),
    meta: { title: '用户详情' }
  }
]