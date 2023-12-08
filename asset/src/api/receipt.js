import request from '@/utils/request.js'
var requestFunc = request
if (window.$wujie) {
  requestFunc = window.$wujie.props.request
}

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