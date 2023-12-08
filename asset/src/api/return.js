import request from '@/utils/request.js'
var requestFunc = request
if (window.$wujie) {
  requestFunc = window.$wujie.props.request
}

// 查询资产归还单信息列表
export function listReturn (query) {
  return requestFunc({
    url: '/asset/return/list',
    method: 'get',
    params: query
  })
}

// 删除资产归还单信息
export function delReturn (assetReturnId) {
  return requestFunc({
    url: '/asset/return/' + assetReturnId,
    method: 'delete'
  })
}