export default [
  {
    path: '/library/category',
    name: 'Library-Category',
    component: () => import('@/views/category/index.vue'),
    meta: { title: '分类' }
  }
]