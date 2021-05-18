<template>
  <!-- 分配权限的弹层 -->
  <el-dialog
    title="分配权限(一级为路由页面查看权限-二级为按钮操作权限)"
    :visible="showAssignDialog"
    @close="closeAssignDialog"
  >
    <!-- 渲染权限带你数据 -->
    <el-tree
      ref="permTree"
      :data="permissionList"
      node-key="id"
      :props="{label:'name'}"
      default-expand-all
      show-checkbox
      check-strictly
    >
    </el-tree>

    <!-- 权限点数据展示 -->
    <template #footer>
      <el-button @click="closeAssignDialog">取消</el-button>
      <el-button type="primary" @click="assignPerms">确定</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { getRoleDetailById, assignPerm } from '@/api/setting'
// 获取权限列表
import { getPermissionList } from '@/api/permission'
// 导入格式化属性结构方法
import { formatTreeData } from '@/utils/index'
export default {
  props: {
    showAssignDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 权限数组数据
      permissionList: [],
      // 角色 id
      roleId: '',
      // 选中权限点数据
      selectedPerms: []
    }
  },
  created() {
    this.getPermissionList()
  },
  methods: {
    // 显示隐藏分配角色权限弹层
    closeAssignDialog () {
      this.$emit('update:showAssignDialog', false)
    },
    // 回显之前选中角色权限
    async getRolePerms (id) {
      // 存储角色 id
      this.roleId = id
      // 父组件传递的 id
      const { permIds } = await getRoleDetailById(id)
      // console.log(permIds)
      // 调用tree组件方法做数据回显
      // 通过setCheckedKeys方法勾选回显数据
      this.$refs.permTree.setCheckedKeys(permIds)
    },
    // 获取权限列表
    async getPermissionList () {
      // 发送请求获取权限列表
      const list = await getPermissionList()
      // 格式化树形结构
      this.permissionList = formatTreeData(list)
    },
    // 分配权限点
    async assignPerms () {
      // 获取选中的权限点ID
      // console.log('获取选中的权限点ID', this.$refs.permTree.getCheckedKeys())
      await assignPerm(
        {
          id: this.roleId,
          permIds: this.$refs.permTree.getCheckedKeys()
        }
      )
      this.$message.success('角色权限点分配成功')
      this.$emit('update:showAssignDialog', false)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
