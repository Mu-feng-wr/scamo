import request from '@/utils/request'

// 查询耗材派发单信息列表
export function listDistribute(query) {
  return request({
    url: '/consume/distribute/list',
    method: 'get',
    params: query
  })
}

// 查询耗材派发单信息详细
export function getDistribute(consumableDistributeId) {
  return request({
    url: '/consume/distribute/' + consumableDistributeId,
    method: 'get'
  })
}

// 新增耗材派发单信息
export function addDistribute(data) {
  return request({
    url: '/consume/distribute',
    method: 'post',
    data: data
  })
}

// 修改耗材派发单信息
export function updateDistribute(data) {
  return request({
    url: '/consume/distribute',
    method: 'put',
    data: data
  })
}

// 删除耗材派发单信息
export function delDistribute(consumableDistributeId) {
  return request({
    url: '/consume/distribute/' + consumableDistributeId,
    method: 'delete'
  })
}