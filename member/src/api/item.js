import request from '@/utils/request'

// 查询加密项设置信息列表
export function listItem(query) {
  return request({
    url: '/memberc/item/list',
    method: 'get',
    params: query
  })
}

// 查询加密项设置信息详细
export function getItem(encrypItemId) {
  return request({
    url: '/memberc/item/' + encrypItemId,
    method: 'get'
  })
}

// 新增加密项设置信息
export function addItem(data) {
  return request({
    url: '/memberc/item',
    method: 'post',
    data: data
  })
}

// 修改加密项设置信息
export function updateItem(data) {
  return request({
    url: '/memberc/item',
    method: 'put',
    data: data
  })
}

// 修改新增加密项设置信息
export function addOrUpdate(data) {
  return request({
    url: '/memberc/item/addOrUpdate',
    method: 'post',
    data: data
  })
}

// 删除加密项设置信息
export function delItem(encrypItemId) {
  return request({
    url: '/memberc/item/' + encrypItemId,
    method: 'delete'
  })
}
