import request from '@/utils/request.js'
var requestFunc = request
// if (window.$wujie) {
//   requestFunc = window.$wujie.props.request
// }

// 查询资产入库单信息列表
export function listReceipt (query) {
  return requestFunc({
    url: '/asset/receipt/list',
    method: 'get',
    params: query
  })
}

// 删除资产入库单信息
export function delReceipt (assetReceiptId) {
  return requestFunc({
    url: '/asset/receipt/' + assetReceiptId,
    method: 'delete'
  })
}

// 获取入库单合计
export function getTotalAmount (query) {
  return requestFunc({
    url: '/asset/receipt/getTotalAmount',
    method: 'get',
    params: query
  })
}

// 查询资产入库单信息详细
export function getReceipt (assetReceiptId) {
  return requestFunc({
    url: '/asset/receipt/' + assetReceiptId,
    method: 'get'
  })
}


// 新增资产入库单信息
export function addReceipt (data) {
  return requestFunc({
    url: '/asset/receipt',
    method: 'post',
    data: data
  })
}

// 修改资产入库单信息
export function updateReceipt (data) {
  return requestFunc({
    url: '/asset/receipt',
    method: 'put',
    data: data
  })
}

// 审核资产入库单信息
export function approveReceipt (data) {
  return requestFunc({
    url: '/asset/receipt/approve',
    method: 'post',
    data: data
  })
}