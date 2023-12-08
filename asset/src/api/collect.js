import request from '@/utils/request.js'
var requestFunc = request
if (window.$wujie) {
  requestFunc = window.$wujie.props.request
}

// 查询资产领用单信息列表
export function listCollect (query) {
  return requestFunc({
    url: '/asset/collect/list',
    method: 'get',
    params: query
  })
}

// 获取入库单合计
export function getTotalAmount (query) {
  return requestFunc({
    url: '/asset/collect/getTotalAmount',
    method: 'get',
    params: query
  })
}

// 删除资产领用单信息
export function delCollect (assetCollectId) {
  return requestFunc({
    url: '/asset/collect/' + assetCollectId,
    method: 'delete'
  })
}