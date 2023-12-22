import request from '@/utils/request.js'

// 查询礼品异动单信息列表
export function listReshuffle(query) {
  return request({
    url: '/gift/reshuffle/list',
    method: 'get',
    params: query
  })
}

// 查询礼品异动单信息详细
export function getReshuffle(giftReshuffleId) {
  return request({
    url: '/gift/reshuffle/' + giftReshuffleId,
    method: 'get'
  })
}

// 新增礼品异动单信息
export function addReshuffle(data) {
  return request({
    url: '/gift/reshuffle',
    method: 'post',
    data: data
  })
}

// 修改礼品异动单信息
export function updateReshuffle(data) {
  return request({
    url: '/gift/reshuffle',
    method: 'put',
    data: data
  })
}

// 删除礼品异动单信息
export function delReshuffle(giftReshuffleId) {
  return request({
    url: '/gift/reshuffle/' + giftReshuffleId,
    method: 'delete'
  })
}
