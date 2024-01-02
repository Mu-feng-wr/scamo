export default [
  {
    path: '/portface/sms',
    name: 'Portface-Sms',
    component: () => import('@/views/sms/index.vue'),
    meta: { title: '短信' }
  }
]