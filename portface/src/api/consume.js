import request from '@/utils/request.js'

// 查询短信消费信息列表
export function listConsume(query) {
  return request({
    url: '/datac/consume/list',
    method: 'get',
    params: query
  })
}

// 查询短信消费信息详细
export function getConsume(id) {
  return request({
    url: '/datac/consume/' + id,
    method: 'get'
  })
}

// 新增短信消费信息
export function addConsume(data) {
  return request({
    url: '/datac/consume',
    method: 'post',
    data: data
  })
}

// 修改短信消费信息
export function updateConsume(data) {
  return request({
    url: '/datac/consume',
    method: 'put',
    data: data
  })
}

// 删除短信消费信息
export function delConsume(id) {
  return request({
    url: '/datac/consume/' + id,
    method: 'delete'
  })
}
