import request from '@/utils/request.js'

// 查询资产异动单信息列表
export function listReshuffle(query) {
  return request({
    url: '/asset/reshuffle/list',
    method: 'get',
    params: query
  })
}

// 删除资产异动单信息
export function delReshuffle(assetReshuffleId) {
  return request({
    url: '/asset/reshuffle/' + assetReshuffleId,
    method: 'delete'
  })
}

// 查询资产调拨单信息列表合计
export function getTotalAmount(query) {
  return request({
    url: '/asset/reshuffle/getTotalAmount',
    method: 'get',
    params: query
  })
}

// 查询资产异动单信息详细
export function getReshuffle(assetReshuffleId) {
  return request({
    url: '/asset/reshuffle/' + assetReshuffleId,
    method: 'get'
  })
}

// 新增资产异动单信息
export function addReshuffle(data) {
  return request({
    url: '/asset/reshuffle',
    method: 'post',
    data: data
  })
}

// 修改资产异动单信息
export function updateReshuffle(data) {
  return request({
    url: '/asset/reshuffle',
    method: 'put',
    data: data
  })
}

// 审核资产异动单信息
export function approveReshuffle (data) {
  return request({
    url: '/asset/receipt/reshuffle',
    method: 'post',
    data: data
  })
}