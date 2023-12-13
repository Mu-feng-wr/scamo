
import request from '@/utils/request.js'

// 查询申购单信息列表
export function listApplicationQuery (query) {
  return request({
    url: '/srm/application/queryList',
    method: 'get',
    params: query
  })
}

// 根据字典Id查询字典项
export function listDictItems (dictCodes) {
  return request({
    url: '/system/items/getDicItemList/' + dictCodes,
    method: 'get'
  })
}

// 查询业务类型信息列表
export function listTypeQuery (query) {
  return request({
    url: '/library/type/queryList',
    method: 'get',
    params: query
  })
}

// 查询库位地址仓库
export function listAddressQueryWarehouse (query) {
  return request({
    url: '/library/address/queryWarehouseList',
    method: 'get',
    params: query
  })
}

// 查询库位地址具体位置信息
export function listAddressQuerySpecificLocation (query) {
  return request({
    url: '/library/address/querySpecificLocationList',
    method: 'get',
    params: query
  })
}


// 查询库位地址使用区域信息
export function listAddressQueryUseArea (query) {
  return request({
    url: '/library/address/queryUseAreaList',
    method: 'get',
    params: query
  })
}

// 查询库位地址信息列表
export function listAddressQuery (query) {
  return request({
    url: '/library/address/queryList',
    method: 'get',
    params: query
  })
}

// 查询招标协议信息列表（下拉）
export function listAgreementQuery (query) {
  return request({
    url: '/datac/agreement/queryList',
    method: 'get',
    params: query
  })
}

// 查询供应商信息列表
export function listSupplierQuery (query) {
  return request({
    url: '/datac/supplier/queryList',
    method: 'get',
    params: query
  })
}

// 查询合同基本信息列表
export function listContractQuery (query) {
  return request({
    url: '/datac/contract/queryList',
    method: 'get',
    params: query
  })
}

export function listAccountQuery (query) {
  return request({
    url: '/datac/account/queryList',
    method: 'get',
    params: query
  })
}

// 查询公司列表
export function findCompanyList () {
  return request({
    url: '/system/user/company',
    method: 'get'
  })
}
// 查询方案信息列表
export function listSchemeQuery (query) {
  return request({
    url: '/datac/scheme/queryList',
    method: 'get',
    params: query
  })
}
// 查询项目信息列表
export function listProjectQuery (query) {
  return request({
    url: '/datac/project/queryList',
    method: 'get',
    params: query
  })
}

// 查询品牌下拉选项
export function listBrandQuery (query) {
  return request({
    url: '/library/brand/queryList',
    method: 'get',
    params: query
  })
}
// 查询部门列表
export function listDept (query) {
  return request({
    url: '/system/dept/list',
    method: 'get',
    params: query
  })
}

// 查询用户列表
export function listUser (query) {
  return request({
    url: '/system/user/list',
    method: 'get',
    params: query
  })
}
// 查询部门下拉树结构
export function deptTreeSelect() {
  return request({
    url: '/system/user/deptTree',
    method: 'get'
  })
}