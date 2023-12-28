export default [
  {
    path: '/library/brand',
    name: 'Library-Brand',
    component: () => import('@/views/brand/index.vue'),
    meta: { title: '品牌' }
  },
  {
    path: '/library/brand/add',
    name: 'Library-Brand-Add',
    component: () => import('@/views/brand/edit.vue'),
    meta: { title: '新增品牌' }
  },
  {
    path: '/library/brand/edit',
    name: 'Library-Brand-Edit',
    component: () => import('@/views/brand/edit.vue'),
    meta: { title: '编辑品牌' }
  },
  {
    path: '/library/brand/detail',
    name: 'Library-Brand-Detail',
    component: () => import('@/views/brand/detail.vue'),
    meta: { title: '品牌详情' }
  }
]