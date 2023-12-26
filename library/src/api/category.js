import request from '@/utils/request.js'

// 查询部门下拉树结构
export function categoryTreeSelect() {
  return request({
    url: '/library/category/categoryTree',
    method: 'get'
  })
}

// 查询物资分类信息列表
export function listCategory(query) {
  return request({
    url: '/library/category/list',
    method: 'get',
    params: query
  })
}

// 查询物资分类信息详细
export function getCategory(categoryId) {
  return request({
    url: '/library/category/' + categoryId,
    method: 'get'
  })
}

// 新增物资分类信息
export function addCategory(data) {
  return request({
    url: '/library/category',
    method: 'post',
    data: data
  })
}

// 修改物资分类信息
export function updateCategory(data) {
  return request({
    url: '/library/category',
    method: 'put',
    data: data
  })
}

// 删除物资分类信息
export function delCategory(categoryId) {
  return request({
    url: '/library/category/' + categoryId,
    method: 'delete'
  })
}