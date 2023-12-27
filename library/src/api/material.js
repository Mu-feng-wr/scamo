import request from '@/utils/request.js'

// 查询物资基础信息列表
export function listMaterial(query) {
  return request({
    url: '/library/material/list',
    method: 'get',
    params: query
  })
}
// 查询物资基础信息列表
export function listMaterialQuery(query) {
  return request({
    url: '/library/material/queryList',
    method: 'get',
    params: query
  })
}


// 查询物资基础信息详细
export function getMaterial(materialId) {
  return request({
    url: '/library/material/' + materialId,
    method: 'get'
  })
}

// 新增物资基础信息
export function addMaterial(data) {
  return request({
    url: '/library/material',
    method: 'post',
    data: data
  })
}

// 修改物资基础信息
export function updateMaterial(data) {
  return request({
    url: '/library/material',
    method: 'put',
    data: data
  })
}

// 删除物资基础信息
export function delMaterial(materialId) {
  return request({
    url: '/library/material/' + materialId,
    method: 'delete'
  })
}
