import request from '@/utils/request'

// 查询在售版本信息列表
export function listSale(query) {
  return request({
    url: '/memberc/sale/list',
    method: 'get',
    params: query
  })
}

// 查询在售版本信息详细
export function getSale(versionSaleId) {
  return request({
    url: '/memberc/sale/' + versionSaleId,
    method: 'get'
  })
}

// 新增在售版本信息
export function addSale(data) {
  return request({
    url: '/memberc/sale',
    method: 'post',
    data: data
  })
}

// 修改在售版本信息
export function updateSale(data) {
  return request({
    url: '/memberc/sale',
    method: 'put',
    data: data
  })
}

// 删除在售版本信息
export function delSale(versionSaleId) {
  return request({
    url: '/memberc/sale/' + versionSaleId,
    method: 'delete'
  })
}
