import request from '@/utils/request.js'

// 查询资产归还单信息列表
export function listReturn (query) {
  return request({
    url: '/asset/return/list',
    method: 'get',
    params: query
  })
}

// 删除资产归还单信息
export function delReturn (assetReturnId) {
  return request({
    url: '/asset/return/' + assetReturnId,
    method: 'delete'
  })
}

// 查询资产归还单信息详细
export function getReturn (assetReturnId) {
  return request({
    url: '/asset/return/' + assetReturnId,
    method: 'get'
  })
}

// 新增资产归还单信息
export function addReturn (data) {
  return request({
    url: '/asset/return',
    method: 'post',
    data: data
  })
}

// 修改资产归还单信息
export function updateReturn (data) {
  return request({
    url: '/asset/return',
    method: 'put',
    data: data
  })
}

// 归还单信息流程操作
export function approveReturn (data) {
  return request({
    url: '/asset/return/approve',
    method: 'post',
    data: data
  })
}