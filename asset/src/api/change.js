import request from '@/utils/request.js'

// 查询资产变更单信息列表
export function listChange(query) {
  return request({
    url: '/asset/change/list',
    method: 'get',
    params: query
  })
}

// 删除资产变更单信息
export function delChange(assetChangeId) {
  return request({
    url: '/asset/change/' + assetChangeId,
    method: 'delete'
  })
}

// 查询资产变更单信息详细
export function getChange(assetChangeId) {
  return request({
    url: '/asset/change/' + assetChangeId,
    method: 'get'
  })
}

// 新增资产变更单信息
export function addChange(data) {
  return request({
    url: '/asset/change',
    method: 'post',
    data: data
  })
}

// 修改资产变更单信息
export function updateChange(data) {
  return request({
    url: '/asset/change',
    method: 'put',
    data: data
  })
}

// 变动单信息流程操作
export function approveChange (data) {
  return request({
    url: '/asset/borrow/change',
    method: 'post',
    data: data
  })
}