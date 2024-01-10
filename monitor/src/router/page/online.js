export default [
  {
    path: '/monitor/online',
    name: 'Monitor-Online',
    component: () => import('@/views/online/index.vue'),
    meta: { title: '在线用户' }
  }
]