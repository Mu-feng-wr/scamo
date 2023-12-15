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

// 查询资产终结单信息详细
export function getScrap(assetScrapId) {
  return request({
    url: '/asset/scrap/' + assetScrapId,
    method: 'get'
  })
}

// 新增资产终结单信息
export function addScrap(data) {
  return request({
    url: '/asset/scrap',
    method: 'post',
    data: data
  })
}

// 修改资产终结单信息
export function updateScrap(data) {
  return request({
    url: '/asset/scrap',
    method: 'put',
    data: data
  })
}

// 审核资产处置
export function approveScrap(data) {
  return request({
    url: '/asset/scrap',
    method: 'put',
    data: data
  })
}