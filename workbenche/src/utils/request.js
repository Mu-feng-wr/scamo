import axios from 'axios'
import { MessageBox, Message, Loading } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import { tansParams, blobValidate } from '@/utils/index.js'
import { saveAs } from 'file-saver'

const errorCode = {
  '401': '认证失败，无法访问系统资源',
  '403': '当前操作没有权限',
  '404': '访问资源不存在',
  'default': '系统未知错误，请反馈给管理员'
}

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API // url = base url + request url
  // timeout: 5000 // request timeout
})

service.interceptors.request.use(
  config => {
    if (getToken()) {
      config.headers['Authorization'] = 'Bearer ' + getToken()
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

service.interceptors.response.use(

  response => {
    const res = response.data

    if (res.code !== 200) {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 1500
      })

      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        MessageBox.confirm('', '', {
          confirmButtonText: 'Re-Login',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error)
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service

var downloadLoadingInstance
// 通用下载方法
export function download(url, params, filename, config) {
  downloadLoadingInstance = Loading.service({ text: '正在下载数据，请稍候", spinner: "el-icon-loading", background: "rgba(0, 0, 0, 0.7)' })
  return service.post(url, params, {
    transformRequest: [(params) => { return tansParams(params) }],
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    responseType: 'blob',
    ...config
  }).then(async(data) => {
    const isLogin = await blobValidate(data)
    if (isLogin) {
      const blob = new Blob([data])
      saveAs(blob, filename)
    } else {
      const resText = await data.text()
      const rspObj = JSON.parse(resText)
      const errMsg = errorCode[rspObj.code] || rspObj.msg || errorCode['default']
      Message.error(errMsg)
    }
    downloadLoadingInstance.close()
  }).catch((r) => {
    console.error(r)
    Message.error('下载文件出现错误，请联系管理员！')
    downloadLoadingInstance.close()
  })
}