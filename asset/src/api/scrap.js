import request from '@/utils/request.js'

// 查询资产终结单信息列表
export function listScrap(query) {
  return request({
    url: '/asset/scrap/list',
    method: 'get',
    params: query
  })
}

// 删除资产终结单信息
export function delScrap(assetScrapId) {
  return request({
    url: '/asset/scrap/' + assetScrapId,
    method: 'delete'
  })
}