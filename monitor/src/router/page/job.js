export default [
  {
    path: '/monitor/job',
    name: 'Monitor-Job',
    component: () => import('@/views/job/index.vue'),
    meta: { title: '定时任务' }
  }
]