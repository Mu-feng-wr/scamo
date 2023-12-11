import request from '@/utils/request.js'
var requestFunc = request
if (window.$wujie) {
  requestFunc = window.$wujie.props.request
}

// 查询资产终结单信息列表
export function listScrap(query) {
  return requestFunc({
    url: '/asset/scrap/list',
    method: 'get',
    params: query
  })
}

// 删除资产终结单信息
export function delScrap(assetScrapId) {
  return requestFunc({
    url: '/asset/scrap/' + assetScrapId,
    method: 'delete'
  })
}