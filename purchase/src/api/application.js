import request from '@/utils/request.js'

// 查询申购单信息列表
export function listApplication (query) {
  return request({
    url: '/srm/application/list',
    method: 'get',
    params: query
  })
}

// 删除申购单信息
export function delApplication (purchaseApplicationId) {
  return request({
    url: '/srm/application/' + purchaseApplicationId,
    method: 'delete'
  })
}

// 获取列表头部统计值
export function getTotalAmount (query) {
  return request({
    url: '/srm/application/getTotalAmount',
    method: 'get',
    params: query
  })
}

// 查询申购单信息详细
export function getApplication (purchaseApplicationId) {
  return request({
    url: '/srm/application/' + purchaseApplicationId,
    method: 'get'
  })
}

// 新增申购单信息
export function addApplication (data) {
  return request({
    url: '/srm/application',
    method: 'post',
    data: data
  })
}

// 修改申购单信息
export function updateApplication (data) {
  return request({
    url: '/srm/application',
    method: 'put',
    data: data
  })
}

// 申购单信息流程操作
export function approveApplication (data) {
  return request({
    url: '/srm/application/approve',
    method: 'post',
    data: data
  })
}