import request from '@/utils/request.js'

// 查询耗材调拨单信息列表
export function listTransfer(query) {
  return request({
    url: '/consume/transfer/list',
    method: 'get',
    params: query
  })
}

// 查询耗材调拨单信息详细
export function getTransfer(consumableTransferId) {
  return request({
    url: '/consume/transfer/' + consumableTransferId,
    method: 'get'
  })
}

// 新增耗材调拨单信息
export function addTransfer(data) {
  return request({
    url: '/consume/transfer',
    method: 'post',
    data: data
  })
}

// 修改耗材调拨单信息
export function updateTransfer(data) {
  return request({
    url: '/consume/transfer',
    method: 'put',
    data: data
  })
}

// 删除耗材调拨单信息
export function delTransfer(consumableTransferId) {
  return request({
    url: '/consume/transfer/' + consumableTransferId,
    method: 'delete'
  })
}