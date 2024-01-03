export default [
  {
    path: '/portface/project',
    name: 'Portface-Project',
    component: () => import('@/views/project/index.vue'),
    meta: { title: '项目' }
  },
  {
    path: '/portface/project/add',
    name: 'Portface-Project-Add',
    component: () => import('@/views/project/edit.vue'),
    meta: { title: '新增项目' }
  },
  {
    path: '/portface/project/edit',
    name: 'Portface-Project-Edit',
    component: () => import('@/views/project/edit.vue'),
    meta: { title: '编辑项目' }
  },
  {
    path: '/portface/project/detail',
    name: 'Portface-Project-Detail',
    component: () => import('@/views/project/detail.vue'),
    meta: { title: '项目详情' }
  }
]