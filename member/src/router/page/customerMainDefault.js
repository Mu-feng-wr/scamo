export default [
  {
    path: '/member/customerMainDefault',
    name: 'Member-CustomerMainDefault',
    component: () => import('@/views/customerMainDefault/index.vue'),
    meta: { title: '公司' }
  }
]