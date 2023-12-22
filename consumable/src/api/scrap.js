import request from '@/utils/request.js'
// 查询耗材终结单信息列表
export function listScrap(query) {
  return request({
    url: '/consume/scrap/list',
    method: 'get',
    params: query
  })
}

// 查询耗材终结单信息详细
export function getScrap(consumableScrapId) {
  return request({
    url: '/consume/scrap/' + consumableScrapId,
    method: 'get'
  })
}

// 新增耗材终结单信息
export function addScrap(data) {
  return request({
    url: '/consume/scrap',
    method: 'post',
    data: data
  })
}

// 修改耗材终结单信息
export function updateScrap(data) {
  return request({
    url: '/consume/scrap',
    method: 'put',
    data: data
  })
}

// 删除耗材终结单信息
export function delScrap(consumableScrapId) {
  return request({
    url: '/consume/scrap/' + consumableScrapId,
    method: 'delete'
  })
}

// 审核耗材处置单信息
export function approveScrap (data) {
  return request({
    url: '/consume/approve/Scrap',
    method: 'post',
    data: data
  })
}