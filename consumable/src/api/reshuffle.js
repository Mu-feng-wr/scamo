import request from '@/utils/request.js'

// 查询耗材异动单信息列表
export function listReshuffle(query) {
  return request({
    url: '/consume/reshuffle/list',
    method: 'get',
    params: query
  })
}

// 查询耗材异动单信息详细
export function getReshuffle(consumableReshuffleId) {
  return request({
    url: '/consume/reshuffle/' + consumableReshuffleId,
    method: 'get'
  })
}

// 新增耗材异动单信息
export function addReshuffle(data) {
  return request({
    url: '/consume/reshuffle',
    method: 'post',
    data: data
  })
}

// 修改耗材异动单信息
export function updateReshuffle(data) {
  return request({
    url: '/consume/reshuffle',
    method: 'put',
    data: data
  })
}

// 删除耗材异动单信息
export function delReshuffle(consumableReshuffleId) {
  return request({
    url: '/consume/reshuffle/' + consumableReshuffleId,
    method: 'delete'
  })
}