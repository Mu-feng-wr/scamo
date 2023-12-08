import request from '@/utils/request'
var requestFunc = request
if (window.$wujie) {
  requestFunc = window.$wujie.props.request
}
// 查询物资台账登记信息列表
export function listRegister(query) {
  return requestFunc({
    url: '/library/materialRegister/list',
    method: 'get',
    params: query
  })
}