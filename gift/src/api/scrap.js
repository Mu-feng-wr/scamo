import request from '@/utils/request.js'

// 查询礼品终结单信息列表
export function listScrap(query) {
  return request({
    url: '/gift/scrap/list',
    method: 'get',
    params: query
  })
}

// 查询礼品终结单信息详细
export function getScrap(giftScrapId) {
  return request({
    url: '/gift/scrap/' + giftScrapId,
    method: 'get'
  })
}

// 新增礼品终结单信息
export function addScrap(data) {
  return request({
    url: '/gift/scrap',
    method: 'post',
    data: data
  })
}

// 修改礼品终结单信息
export function updateScrap(data) {
  return request({
    url: '/gift/scrap',
    method: 'put',
    data: data
  })
}

// 删除礼品终结单信息
export function delScrap(giftScrapId) {
  return request({
    url: '/gift/scrap/' + giftScrapId,
    method: 'delete'
  })
}
