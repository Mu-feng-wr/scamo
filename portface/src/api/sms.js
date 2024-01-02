import request from '@/utils/request.js'

// 查询短信信息列表
export function listSms(query) {
  return request({
    url: '/datac/sms/list',
    method: 'get',
    params: query
  })
}

// 查询短信信息详细
export function getSms(id) {
  return request({
    url: '/datac/sms/' + id,
    method: 'get'
  })
}

// 新增短信信息
export function addSms(data) {
  return request({
    url: '/datac/sms',
    method: 'post',
    data: data
  })
}

// 修改短信信息
export function updateSms(data) {
  return request({
    url: '/datac/sms',
    method: 'put',
    data: data
  })
}

// 删除短信信息
export function delSms(id) {
  return request({
    url: '/datac/sms/' + id,
    method: 'delete'
  })
}
