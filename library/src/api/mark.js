import request from '@/utils/request.js'

// 查询物资标签信息列表
export function listMark(query) {
  return request({
    url: '/library/mark/list',
    method: 'get',
    params: query
  })
}

// 查询物资标签信息详细
export function getMark(materialMarkId) {
  return request({
    url: '/library/mark/' + materialMarkId,
    method: 'get'
  })
}

// 新增物资标签信息
export function addMark(data) {
  return request({
    url: '/library/mark',
    method: 'post',
    data: data
  })
}

// 修改物资标签信息
export function updateMark(data) {
  return request({
    url: '/library/mark',
    method: 'put',
    data: data
  })
}

// 删除物资标签信息
export function delMark(materialMarkId) {
  return request({
    url: '/library/mark/' + materialMarkId,
    method: 'delete'
  })
}
