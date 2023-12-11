import request from '@/utils/request.js'
var requestFunc = request
if (window.$wujie) {
  requestFunc = window.$wujie.props.request
}

// 查询资产变更单信息列表
export function listChange(query) {
  return requestFunc({
    url: '/asset/change/list',
    method: 'get',
    params: query
  })
}

// 删除资产变更单信息
export function delChange(assetChangeId) {
  return requestFunc({
    url: '/asset/change/' + assetChangeId,
    method: 'delete'
  })
}