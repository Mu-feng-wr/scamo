import request from '@/utils/request.js'

// 查询盘点计划信息列表
export function listPlan(query) {
  return request({
    url: '/inventory/plan/list',
    method: 'get',
    params: query
  })
}

// 查询盘点计划信息详细
export function getPlan(inventoryPlanId) {
  return request({
    url: '/inventory/plan/' + inventoryPlanId,
    method: 'get'
  })
}

// 新增盘点计划信息
export function addPlan(data) {
  return request({
    url: '/inventory/plan',
    method: 'post',
    data: data
  })
}

// 修改盘点计划信息
export function updatePlan(data) {
  return request({
    url: '/inventory/plan',
    method: 'put',
    data: data
  })
}

// 删除盘点计划信息
export function delPlan(inventoryPlanId) {
  return request({
    url: '/inventory/plan/' + inventoryPlanId,
    method: 'delete'
  })
}
