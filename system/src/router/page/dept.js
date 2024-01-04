export default [
  {
    path: '/system/dept',
    name: 'System-Dept',
    component: () => import('@/views/dept/index.vue'),
    meta: { title: '组织' }
  }
]