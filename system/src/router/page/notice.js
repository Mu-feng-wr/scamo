export default [
  {
    path: '/system/notice',
    name: 'System-Notice',
    component: () => import('@/views/notice/index.vue'),
    meta: { title: '通知' }
  }
]