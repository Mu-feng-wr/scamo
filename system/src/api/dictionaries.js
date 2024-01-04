import request from '@/utils/request.js'

// 查询数据字典列表
export function listDictionaries(query) {
  return request({
    url: '/system/dictionaries/list',
    method: 'get',
    params: query
  })
}

// 查询数据字典详细
export function getDictionaries(dictionariesId) {
  return request({
    url: '/system/dictionaries/' + dictionariesId,
    method: 'get'
  })
}

// 新增数据字典
export function addDictionaries(data) {
  return request({
    url: '/system/dictionaries',
    method: 'post',
    data: data
  })
}

// 修改数据字典
export function updateDictionaries(data) {
  return request({
    url: '/system/dictionaries',
    method: 'put',
    data: data
  })
}

// 删除数据字典
export function delDictionaries(dictionariesId) {
  return request({
    url: '/system/dictionaries/' + dictionariesId,
    method: 'delete'
  })
}
