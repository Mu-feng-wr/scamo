import request from '@/utils/request.js'

// 查询资产领用单信息列表
export function listCollect (query) {
  return request({
    url: '/asset/collect/list',
    method: 'get',
    params: query
  })
}

// 获取入库单合计
export function getTotalAmount (query) {
  return request({
    url: '/asset/collect/getTotalAmount',
    method: 'get',
    params: query
  })
}

// 删除资产领用单信息
export function delCollect (assetCollectId) {
  return request({
    url: '/asset/collect/' + assetCollectId,
    method: 'delete'
  })
}

// 查询资产领用单信息详细
export function getCollect (assetCollectId) {
  return request({
    url: '/asset/collect/' + assetCollectId,
    method: 'get'
  })
}
// 新增资产领用单信息
export function addCollect (data) {
  return request({
    url: '/asset/collect',
    method: 'post',
    data: data
  })
}

// 修改资产领用单信息
export function updateCollect (data) {
  return request({
    url: '/asset/collect',
    method: 'put',
    data: data
  })
}

// 领用单信息流程操作
export function approveCollect (data) {
  return request({
    url: '/asset/collect/approve',
    method: 'post',
    data: data
  })
}