import request from '@/utils/request.js'

// 查询资产维修单信息列表
export function listRepair (query) {
  return request({
    url: '/asset/repair/list',
    method: 'get',
    params: query
  })
}

// 删除资产维修单信息
export function delRepair (assetRepairId) {
  return request({
    url: '/asset/repair/' + assetRepairId,
    method: 'delete'
  })
}

// 查询资产维修单信息详细
export function getRepair (assetRepairId) {
  return request({
    url: '/asset/repair/' + assetRepairId,
    method: 'get'
  })
}

// 新增资产维修单信息
export function addRepair (data) {
  return request({
    url: '/asset/repair',
    method: 'post',
    data: data
  })
}

// 修改资产维修单信息
export function updateRepair (data) {
  return request({
    url: '/asset/repair',
    method: 'put',
    data: data
  })
}

// 领用单信息流程操作
export function approveRepair (data) {
  return request({
    url: '/asset/collect/repair',
    method: 'post',
    data: data
  })
}