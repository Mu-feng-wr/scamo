import request from '@/utils/request.js'

// 查询供应商信息列表
export function listSupplier(query) {
  return request({
    url: '/datac/supplier/list',
    method: 'get',
    params: query
  })
}

// 查询供应商信息列表
export function listSupplierQuery(query) {
  return request({
    url: '/datac/supplier/queryList',
    method: 'get',
    params: query
  })
}

// 查询供应商信息详细
export function getSupplier(supplierId) {
  return request({
    url: '/datac/supplier/' + supplierId,
    method: 'get'
  })
}

// 新增供应商信息
export function addSupplier(data) {
  return request({
    url: '/datac/supplier',
    method: 'post',
    data: data
  })
}

// 修改供应商信息
export function updateSupplier(data) {
  return request({
    url: '/datac/supplier',
    method: 'put',
    data: data
  })
}

// 删除供应商信息
export function delSupplier(supplierId) {
  return request({
    url: '/datac/supplier/' + supplierId,
    method: 'delete'
  })
}
