export default [
  {
    path: '/library/material',
    name: 'Library-Material',
    component: () => import('@/views/material/index.vue'),
    meta: { title: '物资' }
  },
  {
    path: '/library/material/add',
    name: 'Library-Material-Add',
    component: () => import('@/views/material/edit.vue'),
    meta: { title: '新增物资' }
  },
  {
    path: '/library/material/edit',
    name: 'Library-Material-Edit',
    component: () => import('@/views/material/edit.vue'),
    meta: { title: '编辑物资' }
  },
  {
    path: '/library/material/detail',
    name: 'Library-Material-Detail',
    component: () => import('@/views/material/detail.vue'),
    meta: { title: '物资详情' }
  }
]