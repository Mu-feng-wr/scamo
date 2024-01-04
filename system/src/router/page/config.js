export default [
  {
    path: '/system/config',
    name: 'System-Config',
    component: () => import('@/views/config/index.vue'),
    meta: { title: '参数' }
  }
]