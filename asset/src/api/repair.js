import request from '@/utils/request.js'
var requestFunc = request
if (window.$wujie) {
  requestFunc = window.$wujie.props.request
}

// 查询资产维修单信息列表
export function listRepair (query) {
  return requestFunc({
    url: '/asset/repair/list',
    method: 'get',
    params: query
  })
}

// 删除资产维修单信息
export function delRepair (assetRepairId) {
  return requestFunc({
    url: '/asset/repair/' + assetRepairId,
    method: 'delete'
  })
}