<template>
  <el-dialog class="assign-role" title="分配角色" :visible="showRoleDialog" @close="closeDialog">
    <!-- 这里准备复选框 -->
    <el-checkbox-group v-model="selectRoles">
      <!-- lable :决定当前选中的值 -->
      <el-checkbox v-for="role in roleList" :key="role.id" :label="role.id">{{ role.name }}</el-checkbox>
    </el-checkbox-group>
    <template #footer>
      <!-- button 只有点击事件没有 submit 事件 -->
      <el-button type="primary" size="small" @click="submitRole">确定</el-button>
      <el-button size="small" @click="closeDialog">取消</el-button>
    </template>

  </el-dialog>
</template>

<script>
// 获取角色列表数据
import { getRoleList } from '@/api/setting'
// 获取已经选择过的角色数据
import { getUserDetailById } from '@/api/user'
// 分配用户角色
import { assignRoles } from '@/api/employees'
export default {
  name: 'AssignRole',
  props: {
    // 展示隐藏弹层
    showRoleDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 角色数据
      roleList: [],
      // 角色id
      selectRoles: [],
      // 当前员工 id
      currentId: ''
    }
  },
  created() {
    this.getRoleList()
    // this.getSelectedRole()
    // this.submitRole()
  },
  methods: {
    // 关闭分配角色弹层
    closeDialog() {
      this.$emit('update:showRoleDialog', false)
    },
    // 获取弹层角色数据
    // 传递两个参数 params: { page, pageSize}
    async getRoleList() {
      const { rows } = await getRoleList({ page: 1, pageSize: 100 })
      // console.table(rows)
      this.roleList = rows
    },
    /**
     * 回显上次选择的角色数据
     * 使用 ref
     * 1. 子组件提供获取员工详情 id 方法,获取已经选择的角色信息
     * 2. 父组件调用这个方法
     */
    async getSelectedRole (id) {
      // 存储当前员工 id
      this.currentId = id
      const { roleIds } = await getUserDetailById(id)
      // console.log(roleIds)
      this.selectRoles = roleIds
    },
    // 点击确定分配角色 { id:当前用户id, roleIds:选中的角色id组成的数组 }
    async submitRole () {
      await assignRoles({ id: this.currentId, roleIds: this.selectRoles })
      this.$message.success('分配角色成功')
      // 通知父组件关闭弹窗
      this.$emit('update:showRoleDialog', false)
    }
  }
}
</script>

<style lang="scss" scope>
.assign-role {
  ::v-deep {
    .el-checkbox {
      margin-bottom: 20px;
    }
  }
}

</style>
