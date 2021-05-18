import request from '@/utils/request'

/**
 * @description: 登录
 * @param {*} data {modile, password}
 * @return {*}
 */
export function login (data) {
  return request({
    url: '/sys/login',
    method: 'post',
    data
  })
}

/**
 * @description: 获取用户资料
 * @param {*}
 * @return {*}
 */
export function getUserInfo () {
  return request({
    url: '/sys/profile',
    method: 'post'
  })
}

/**
 * @description: 获取用户头详情
 * @param {*} id 用户id
 * @return {*}
 */
export function getUserDetailById (id) {
  return request({
    url: `/sys/user/${id}`
  })
}

/**
 * @description: 保存员工信息
 * @param {*} data
 * @return {*}
 */
export function saveUserDetailById (data) {
  return request({
    url: `/sys/user/${data.id}`,
    method: 'put',
    data
  })
}
