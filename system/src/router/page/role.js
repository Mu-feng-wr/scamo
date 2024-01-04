export default [
  {
    path: '/system/role',
    name: 'System-Role',
    component: () => import('@/views/role/index.vue'),
    meta: { title: '角色' }
  }
]