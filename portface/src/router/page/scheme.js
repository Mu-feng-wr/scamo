export default [
  {
    path: '/portface/scheme',
    name: 'Portface-Scheme',
    component: () => import('@/views/scheme/index.vue'),
    meta: { title: '方案' }
  },
  {
    path: '/portface/scheme/add',
    name: 'Portface-Scheme-Add',
    component: () => import('@/views/scheme/edit.vue'),
    meta: { title: '新增方案' }
  },
  {
    path: '/portface/scheme/edit',
    name: 'Portface-Scheme-Edit',
    component: () => import('@/views/scheme/edit.vue'),
    meta: { title: '编辑方案' }
  },
  {
    path: '/portface/scheme/detail',
    name: 'Portface-Scheme-Detail',
    component: () => import('@/views/scheme/detail.vue'),
    meta: { title: '方案详情' }
  }
]