import axios from 'axios'
// 导入饿了吗消息提示组件  请求报错使用它提示报错信息
import { Message } from 'element-ui'
// 导入 vuex 获取token消息
import store from '@/store'
// 导入路由信息实例
import router from '@/router'
// import { getToken } from '@/utils/auth'

// create an axios instance
// 创建 axios 新实例  作为请求实例
const service = axios.create({
  // 设置axios请求的基础的基础地址
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  // 定义5秒超时
  timeout: 5000 // request timeout
})

// request interceptor
// 请求拦截器 发请求之前会执行
service.interceptors.request.use(
  config => {
    // 请求正常
    if (store.getters.token) {
      // 如果请求正常则存储token
      config.headers['Authorization'] = `Bearer ${store.getters.token}`
    }
    // do something before request is sent

    // if (store.getters.token) {
    // let each request carry token
    // ['X-Token'] is a custom headers key
    // please modify it according to the actual situation
    // config.headers['X-Token'] = getToken()
    // }
    return config
  },
  error => {
    // 请求错误进到这里
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
// 响应拦截器 请求响应了先执行 注意:页面还没有拿到数据
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  // 响应拦截器=》请求响应了先执行=》注意：页面还没拿到数据
  ({ data }) => {
    // 简化后台返回的数据做处理
    const { success, message, data: datas } = data
    if (success) {
      return datas
    } else {
      // 异常处理消息
      Message({
        message: message,
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(message)
    }
  },
  error => {
    console.log('err' + error) // for debug
    // token 失效处理
    if (error.response && error.response.status === 401) {
      if (router.currentRoute.path === '/login') return
      // 登出action 删除token和用户信息
      store.dispatch('user/logout')
      router.replace(`/login?redirect=${router.currentRoute.path}`)
      // console.log(router.currentRoute.path)
    }
    // token失效信息提示
    Message({
      message: error.response.data.message,
      type: 'error',
      duration: 3 * 1000
    })
    return Promise.reject(error)
  }
)

// 导入新创建的 axios 实例
export default service
