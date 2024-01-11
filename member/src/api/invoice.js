import request from '@/utils/request'

// 查询开票信息列表
export function listInvoice(query) {
  return request({
    url: '/memberc/invoice/list',
    method: 'get',
    params: query
  })
}

// 查询开票信息详细
export function getInvoice(invoiceId) {
  return request({
    url: '/memberc/invoice/' + invoiceId,
    method: 'get'
  })
}

// 通过客户ID查询企业信息详细
export function getInvoiceByCustomerId(customerId) {
  return request({
    url: '/memberc/invoice/getInvoiceByCustomerId/' + customerId,
    method: 'get'
  })
}

// 新增开票信息
export function addInvoice(data) {
  return request({
    url: '/memberc/invoice',
    method: 'post',
    data: data
  })
}

// // 修改开票信息
// export function updateInvoice(data) {
//   return request({
//     url: '/memberc/invoice',
//     method: 'put',
//     data: data
//   })
// }

// 删除开票信息
export function delInvoice(invoiceId) {
  return request({
    url: '/memberc/invoice/' + invoiceId,
    method: 'delete'
  })
}


/**
 * 获取自身开票信息
 */
export function findInovice() {
  return request({
    url: '/memberc/api/invoice/self',
    method: 'get'
  })
}

/**
 * 根据条件获取开票信息
 * 
 * param.invoiceId 主键id
 * param.customerId 客户id
 * param.companyName 公司名称
 * param.taxpayerIdNum 纳税号
 * param.bankAccount 银行账号
 * param.address 地址
 * param.mobile 手机
 * param.unifiedSystemNumber 客户唯一编码
 */
export function findInoviceByCondition(param) {
  return request({
    url: '/memberc/api/invoice',
    method: 'get',
    params: param
  })
}

/**
 * 根据条件获取开票信息
 * id 主键id
 * param.taxpayerIdNum 纳税号
 * param.bankAccount 银行账号
 * param.mobile 手机
 */
export function updateInvoice(id,param) {
  return request({
    url: '/memberc/api/invoice/'+id,
    method: 'put',
    data: param
  })
}


