import request from '@/utils/request.js'

// 查询礼品归还单信息列表
export function listReturn(query) {
  return request({
    url: '/gift/return/list',
    method: 'get',
    params: query
  })
}

// 查询礼品归还单信息详细
export function getReturn(giftReturnId) {
  return request({
    url: '/gift/return/' + giftReturnId,
    method: 'get'
  })
}

// 新增礼品归还单信息
export function addReturn(data) {
  return request({
    url: '/gift/return',
    method: 'post',
    data: data
  })
}

// 修改礼品归还单信息
export function updateReturn(data) {
  return request({
    url: '/gift/return',
    method: 'put',
    data: data
  })
}

// 删除礼品归还单信息
export function delReturn(giftReturnId) {
  return request({
    url: '/gift/return/' + giftReturnId,
    method: 'delete'
  })
}
