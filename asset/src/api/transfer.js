import request from '@/utils/request.js'

// 查询资产调拨单信息列表
export function listTransfer (query) {
  return request({
    url: '/asset/transfer/list',
    method: 'get',
    params: query
  })
}

// 查询资产调拨单信息列表合计
export function getTotalAmount (query) {
  return request({
    url: '/asset/transfer/getTotalAmount',
    method: 'get',
    params: query
  })
}

// 删除资产调拨单信息
export function delTransfer (assetTransferId) {
  return request({
    url: '/asset/transfer/' + assetTransferId,
    method: 'delete'
  })
}

// 查询资产调拨单信息详细
export function getTransfer (assetTransferId) {
  return request({
    url: '/asset/transfer/' + assetTransferId,
    method: 'get'
  })
}

// 新增资产调拨单信息
export function addTransfer (data) {
  return request({
    url: '/asset/transfer',
    method: 'post',
    data: data
  })
}

// 修改资产调拨单信息
export function updateTransfer (data) {
  return request({
    url: '/asset/transfer',
    method: 'put',
    data: data
  })
}

// 调拨单信息流程操作
export function approveTransfer (data) {
  return request({
    url: '/asset/transfer/approve',
    method: 'post',
    data: data
  })
}