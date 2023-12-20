import request from '@/utils/request.js'

// 查询耗材领用单信息列表
export function listCollect(query) {
  return request({
    url: '/consume/collect/list',
    method: 'get',
    params: query
  })
}

// 查询耗材领用单信息详细
export function getCollect(consumableCollectId) {
  return request({
    url: '/consume/collect/' + consumableCollectId,
    method: 'get'
  })
}

// 新增耗材领用单信息
export function addCollect(data) {
  return request({
    url: '/consume/collect',
    method: 'post',
    data: data
  })
}

// 修改耗材领用单信息
export function updateCollect(data) {
  return request({
    url: '/consume/collect',
    method: 'put',
    data: data
  })
}

// 删除耗材领用单信息
export function delCollect(consumableCollectId) {
  return request({
    url: '/consume/collect/' + consumableCollectId,
    method: 'delete'
  })
}

// 领用单信息流程操作
export function approveCollect (data) {
  return request({
    url: '/consume/collect/approve',
    method: 'post',
    data: data
  })
}

// 获取入库单合计
export function getTotalAmount (query) {
  return request({
    url: '/consume/collect/getTotalAmount',
    method: 'get',
    params: query
  })
}
