import request from '@/utils/request.js'

// 查询资产入库单信息列表
export function listReceipt (query) {
  return request({
    url: '/asset/receipt/list',
    method: 'get',
    params: query
  })
}

// 删除资产入库单信息
export function delReceipt (assetReceiptId) {
  return request({
    url: '/asset/receipt/' + assetReceiptId,
    method: 'delete'
  })
}

// 获取入库单合计
export function getTotalAmount (query) {
  return request({
    url: '/asset/receipt/getTotalAmount',
    method: 'get',
    params: query
  })
}

// 查询资产入库单信息详细
export function getReceipt (assetReceiptId) {
  return request({
    url: '/asset/receipt/' + assetReceiptId,
    method: 'get'
  })
}


// 新增资产入库单信息
export function addReceipt (data) {
  return request({
    url: '/asset/receipt',
    method: 'post',
    data: data
  })
}

// 修改资产入库单信息
export function updateReceipt (data) {
  return request({
    url: '/asset/receipt',
    method: 'put',
    data: data
  })
}

// 审核资产入库单信息
export function approveReceipt (data) {
  return request({
    url: '/asset/receipt/approve',
    method: 'post',
    data: data
  })
}