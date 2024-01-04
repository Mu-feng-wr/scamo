export default [
  {
    path: '/system/post',
    name: 'System-Post',
    component: () => import('@/views/post/index.vue'),
    meta: { title: '岗位' }
  }
]