import request from '@/utils/request'

// 查询耗材归还单信息列表
export function listReturn(query) {
  return request({
    url: '/consume/return/list',
    method: 'get',
    params: query
  })
}

// 查询耗材归还单信息详细
export function getReturn(consumableReturnId) {
  return request({
    url: '/consume/return/' + consumableReturnId,
    method: 'get'
  })
}

// 新增耗材归还单信息
export function addReturn(data) {
  return request({
    url: '/consume/return',
    method: 'post',
    data: data
  })
}

// 修改耗材归还单信息
export function updateReturn(data) {
  return request({
    url: '/consume/return',
    method: 'put',
    data: data
  })
}

// 删除耗材归还单信息
export function delReturn(consumableReturnId) {
  return request({
    url: '/consume/return/' + consumableReturnId,
    method: 'delete'
  })
}

// 获取入库单合计
export function getTotalAmount (query) {
  return request({
    url: '/consume/return/getTotalAmount',
    method: 'get',
    params: query
  })
}

// 归还单信息流程操作
export function approveReturn (data) {
  return request({
    url: '/consume/return/approve',
    method: 'post',
    data: data
  })
}
