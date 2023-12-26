export default [
  {
    path: '/library/category',
    name: 'Library-category',
    component: () => import('@/views/category/index.vue'),
    meta: { title: '分类' }
  }
]