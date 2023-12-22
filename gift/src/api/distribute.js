import request from '@/utils/request.js'

// 查询礼品派发单信息列表
export function listDistribute(query) {
  return request({
    url: '/gift/distribute/list',
    method: 'get',
    params: query
  })
}

// 查询礼品派发单信息详细
export function getDistribute(giftDistributeId) {
  return request({
    url: '/gift/distribute/' + giftDistributeId,
    method: 'get'
  })
}

// 新增礼品派发单信息
export function addDistribute(data) {
  return request({
    url: '/gift/distribute',
    method: 'post',
    data: data
  })
}

// 修改礼品派发单信息
export function updateDistribute(data) {
  return request({
    url: '/gift/distribute',
    method: 'put',
    data: data
  })
}

// 删除礼品派发单信息
export function delDistribute(giftDistributeId) {
  return request({
    url: '/gift/distribute/' + giftDistributeId,
    method: 'delete'
  })
}
