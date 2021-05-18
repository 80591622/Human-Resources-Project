import request from '@/utils/request'

// 获取部门信息 API
export function getDepartments () {
  return request({
    url: '/company/department'
  })
}

/**
 * @description: 删除部门
 * @param {*} id 当前点击的操作按钮 所在的项的id
 * @return {*}
 */
export function delDepartments (id) {
  return request({
    url: `/company/department/${id}`,
    method: 'delete'
  })
}

/**
 * @description: 获取部门详情
 * @param {*} id 表示当前要编辑项的id值
 * @return {*}
 */
export function getDepartDetail (id) {
  return request({
    url: `/company/department/${id}`
  })
}

/**
  * @description: 更新部门数据
  * @param {*} data:form表单数据 但是要有id值
  * @return {*}
  */
export function updateDepartments (data) {
  return request({
    url: `/company/department/${data.id}`,
    method: 'put',
    data
  })
}

/**
 * @description: 新增子部分
 * @param {*}
        data {
            name: '', // 部门名称
            code: '', // 部门编码
            manager: '', // 部门管理者
            introduce: '', // 部门介绍
            pid: '' // 新增子部门给谁 (直接获取不到)
        }
 * @return {*}
 */
export function addDepartments (data) {
  return request({
    url: '/company/department',
    method: 'post',
    data
  })
}
