export default [
  {
    path: '/system/log/operlog',
    name: 'System-Log-Operlog',
    component: () => import('@/views/log/operlog/index.vue'),
    meta: { title: '操作日志' }
  },
  {
    path: '/system/log/logininfor',
    name: 'System-Log-Logininfor',
    component: () => import('@/views/log/logininfor/index.vue'),
    meta: { title: '登录日志' }
  }
]