export default [
  {
    path: '/portface/consume',
    name: 'Portface-Consume',
    component: () => import('@/views/consume/index.vue'),
    meta: { title: '短信消费' }
  }
]