import request from '@/utils/request'
// console.log(window.$wujie.props.request)
// const request1=window.$wujie.props.request
/** 获取待办列表 */
export const getReviewListIsCompleted = (query) => {
  return request({
    url: '/review/review/getReviewListIsCompleted',
    method: 'get',
    params: query
  })
}
