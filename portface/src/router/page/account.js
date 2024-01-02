export default [
  {
    path: '/portface/account',
    name: 'Portface-Account',
    component: () => import('@/views/account/index.vue'),
    meta: { title: '账户' }
  }
]