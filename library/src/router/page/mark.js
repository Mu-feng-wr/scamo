export default [
  {
    path: '/library/mark',
    name: 'Library-Mark',
    component: () => import('@/views/mark/index.vue'),
    meta: { title: '标签' }
  },
  {
    path: '/library/mark/add',
    name: 'Library-Mark-Add',
    component: () => import('@/views/mark/edit.vue'),
    meta: { title: '新增标签' }
  },
  {
    path: '/library/mark/edit',
    name: 'Library-Mark-Edit',
    component: () => import('@/views/mark/edit.vue'),
    meta: { title: '编辑标签' }
  },
  {
    path: '/library/mark/detail',
    name: 'Library-Mark-Detail',
    component: () => import('@/views/mark/detail.vue'),
    meta: { title: '标签详情' }
  }
]