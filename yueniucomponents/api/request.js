import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import Cookies from 'js-cookie'
// create an axios instance
const service = axios.create({
  baseURL: '' // url = base url + request url
  // timeout: 5000 // request timeout
})

service.interceptors.request.use(
  config => {
    if (Cookies.get('token')) {
      config.headers['Authorization'] = 'Bearer ' + Cookies.get('token')
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
