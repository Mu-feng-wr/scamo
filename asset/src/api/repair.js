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