import request from '@/utils/request'

// 获取角色列表
// 两个参数 params: { page, pageSize}
export function getRoleList (params) {
  return request({
    url: '/sys/role',
    params
  })
}

// 删除角色
// 传入参数 角色id
export function deleteRole (id) {
  return request({
    url: `/sys/role/${id}`,
    method: 'delete'
  })
}

// 新增角色
// 参数: data {name, description}
// 名字和角色描述
export function addRole (data) {
  return request({
    url: '/sys/role',
    data,
    method: 'post'
  })
}

// 获取回填数据详情
// 参数:id
export function getRoleDetail (id) {
  return request({
    url: `/sys/role/${id}`

  })
}

// 编辑角色
// 参数: data
export function updateRole (data) {
  return request({
    url: `/sys/role/${data.id}`,
    data,
    method: 'put'
  })
}

/**
 * @description: 获取角色下的权限点
 * @param {*} id 当前角色id
 * @return {*}
 */
export function getRoleDetailById (id) {
  return request({
    url: `/sys/role/${id}`
  })
}

/**
 *
 * @param {*} data 给角色分配权限 {id:角色id, permIds:[] 所有选中的节点的id组成的数组}
 * @returns
 */
export function assignPerm (data) {
  return request({
    url: '/sys/role/assignPrem',
    method: 'put',
    data
  })
}
