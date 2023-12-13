import request from '@/utils/request'

// 查询部门下拉树结构
export function categoryTreeSelect() {
  return request({
    url: '/library/category/categoryTree',
    method: 'get'
  })
}