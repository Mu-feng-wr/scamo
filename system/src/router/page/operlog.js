export default [
  {
    path: '/system/operlog',
    name: 'System-Operlog',
    component: () => import('@/views/operlog/index.vue'),
    meta: { title: '操作日志' }
  }
]