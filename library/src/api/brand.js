import request from '@/utils/request'

// 查询品牌信息列表
export function listBrand(query) {
  return request({
    url: '/library/brand/list',
    method: 'get',
    params: query
  })
}

// 查询品牌下拉选项
export function listBrandQuery(query) {
  return request({
    url: '/library/brand/queryList',
    method: 'get',
    params: query
  })
}

// 查询品牌信息详细
export function getBrand(brandId) {
  return request({
    url: '/library/brand/' + brandId,
    method: 'get'
  })
}

// 新增品牌信息
export function addBrand(data) {
  return request({
    url: '/library/brand',
    method: 'post',
    data: data
  })
}

// 修改品牌信息
export function updateBrand(data) {
  return request({
    url: '/library/brand',
    method: 'put',
    data: data
  })
}

// 删除品牌信息
export function delBrand(brandId) {
  return request({
    url: '/library/brand/' + brandId,
    method: 'delete'
  })
}
