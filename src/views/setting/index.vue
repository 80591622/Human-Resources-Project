<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <!-- 放置页签 -->
          <el-tab-pane label="角色管理">
            <!-- 新增角色按钮 -->
            <el-row style="padding: 10px 0">
              <el-button icon="el-icon-plus" size="small" type="primary" @click="isShowDialog=true">新增角色</el-button>
            </el-row>
            <!-- 表格 -->
            <el-table :data="tableData">
              <el-table-column label="序号" type="index" width="120" />
              <el-table-column label="角色名称" width="240" prop="name" />
              <el-table-column label="描述" prop="description" />
              <el-table-column label="操作">
                <!-- 使用作用域插槽获取当前行数据 -->
                <template #default="{ row }">
                  <el-button size="small" type="success" @click="assignPerm(row.id)">分配权限</el-button>
                  <el-button size="small" type="primary" @click="editRole(row.id)">编辑</el-button>
                  <el-button size="small" type="danger" @click="delRole(row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页组件 -->
            <el-row type="flex" justify="center" align="middle" style="height: 60px">
              <!-- 分页组件 -->
              <el-pagination layout="prev,pager,next" :current-page="pages.page" :page-size="pages.pagesize" :total="total" @current-change="changePage" />
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </el-card>

    </div>
    <!-- 新增/编辑 -->
    <el-dialog :title="roleForm.id?'编辑角色':'新增角色'" :visible.sync="isShowDialog" width="40%" @close="closeDialog">
      <!-- 弹层内容 -->
      <el-form ref="roleForm" :model="roleForm" :rules="rules" label-width="100px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleForm.name" />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="roleForm.description" />
        </el-form-item>
      </el-form>
      <!-- 弹层底部 -->
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" @click="closeDialog">取消</el-button>
          <el-button size="small" type="primary" @click="addOrEditRole">
            {{ roleForm.id?'编辑':'新增' }}
          </el-button>
        </el-col>
      </el-row>
    </el-dialog>

    <!-- 分配权限子组件 -->
    <AssignPerm ref="aperm" :show-assign-dialog.sync="showAssignDialog" />
  </div>
</template>

<script>
import { getRoleList, deleteRole, addRole, getRoleDetail, updateRole } from '@/api/setting.js'
// 导入分配权限子组件
import AssignPerm from './components/assign-perm'

export default {
  components: {
    AssignPerm
  },
  data () {
    return {
      // 控制分配权限弹层
      showAssignDialog: false,
      // 表单数据
      roleForm: {
        name: '',
        description: ''
      },
      // 验证字段
      rules: {
        name: [
          { require: true, message: '角色名必填', trigger: 'blur' },
          { min: 2, max: 8, message: '角色名字最小长度2位,最大长度8位', trigger: ['blur', 'change'] }
        ]
      },
      // 控制新增弹层的显示
      isShowDialog: false,
      // 角色列表数据
      tableData: [],
      // 分页数据
      pages: {
        page: 1, // 默认显示页码
        pagesize: 10 // 每页数据
      },
      // 角色列表数据总数
      total: 0
    }
  },
  created () {
    // 获取角色列表
    this.getRoleList()
  },
  methods: {
    // 分配用户权限弹层
    assignPerm(roleId) {
      this.showAssignDialog = true
      this.$refs.aperm.getRolePerms(roleId)
    },

    // 关闭弹层触发
    closeDialog () {
      // 清空表单数据
      this.roleForm = {
        name: '',
        description: ''
      }
      // 移除校检
      this.$refs.roleForm.resetFields()
      // 关闭弹窗
      this.isShowDialog = false
    },
    // 获取角色列表
    async getRoleList () {
      const { total, rows } = await getRoleList(this.pages)
      // console.log(total, rows)
      // 分页页数
      this.total = total
      // 角色列表全部数据
      this.tableData = rows
    },
    // 分页切换
    changePage (newPage) {
      // 将当前页码赋值给最新页码
      this.pages.page = newPage
      // 根据当前页码请求列表数据
      this.getRoleList()
    },
    // 删除角色数据
    async delRole (id) {
      /**
       * 思路：
       * 1. 用户确认
       * 2. 确认后删除
       * 3. 数据库删除=》调用接口
       * 4. 前端删除=》重新获取列表数据
       */
      // 使用try/catch捕获点击取消的错误
      try {
        await this.$confirm('确认删除角色吗？', '提示')
        // 点击确定会执行到这里
        console.log('用户点了确定')
        await deleteRole(id)
        this.$message.success('删除成功！')
        this.getRoleList()
      } catch (error) {
        // 点击取消进入这里
        console.log(error)
      }
    },
    // 新增或编辑角色
    addOrEditRole () {
      /**
         * 1. 表单整体校检 ref
         * 2.校检通过调用接口处理数据
         * 3. 刷新列表,关闭弹层
         */
      this.$refs.roleForm.validate(async (isOk) => {
        if (isOk) {
          if (this.roleForm.id) {
            // 编辑
            // console.log(123)
            await updateRole(this.roleForm)
          } else {
            // 新增
            // 校检通过
            await addRole(this.roleForm)
          }

          // 成功后提示
          this.$message.success('操作成功')
          // 重新获取列表数据
          this.getRoleList()
          // 关闭弹层
          this.isShowDialog = false
        }
      })
    },
    // 编辑角色
    async editRole (id) {
      this.isShowDialog = true
      // 调用接口获取回填数据
      const res = await getRoleDetail(id)
      // console.log(res)
      this.roleForm = res
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
