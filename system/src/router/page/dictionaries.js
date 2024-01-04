export default [
  {
    path: '/system/dictionaries',
    name: 'System-Dictionaries',
    component: () => import('@/views/dictionaries/index.vue'),
    meta: { title: '字典' }
  }
]