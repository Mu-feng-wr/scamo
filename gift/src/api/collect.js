import request from '@/utils/request.js'

// 查询礼品领用单信息列表
export function listCollect(query) {
  return request({
    url: '/gift/collect/list',
    method: 'get',
    params: query
  })
}

// 查询礼品领用单信息详细
export function getCollect(giftCollectId) {
  return request({
    url: '/gift/collect/' + giftCollectId,
    method: 'get'
  })
}

// 新增礼品领用单信息
export function addCollect(data) {
  return request({
    url: '/gift/collect',
    method: 'post',
    data: data
  })
}

// 修改礼品领用单信息
export function updateCollect(data) {
  return request({
    url: '/gift/collect',
    method: 'put',
    data: data
  })
}

// 删除礼品领用单信息
export function delCollect(giftCollectId) {
  return request({
    url: '/gift/collect/' + giftCollectId,
    method: 'delete'
  })
}
