export default [
  {
    path: '/system/user',
    name: 'System-User',
    component: () => import('@/views/user/index.vue'),
    meta: { title: '用户' }
  }
]