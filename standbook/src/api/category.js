import request from '@/utils/request'
var requestFunc = request
if (window.$wujie) {
  requestFunc = window.$wujie.props.request
}

// 查询部门下拉树结构
export function categoryTreeSelect() {
  return requestFunc({
    url: '/library/category/categoryTree',
    method: 'get'
  })
}