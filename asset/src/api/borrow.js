import request from '@/utils/request.js'
var requestFunc = request
if (window.$wujie) {
  requestFunc = window.$wujie.props.request
}

// 查询资产借用单信息列表
export function listBorrow (query) {
  return requestFunc({
    url: '/asset/borrow/list',
    method: 'get',
    params: query
  })
}

// 删除资产借用单信息
export function delBorrow (assetBorrowId) {
  return requestFunc({
    url: '/asset/borrow/' + assetBorrowId,
    method: 'delete'
  })
}