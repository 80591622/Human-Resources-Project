<template>
  <!-- 权限管理 -->
  <div class="permission-container">
    <div class="app-container">
      <!-- 表格 -->
      <el-card shadow="always" :body-style="{ padding: '20px' }">
        <div slot="header">
          <el-row type="flex" justify="space-between" align="middle">
            <span>权限管理</span>
            <el-button type="primary" @click="openDialog(1, '0')">
              新增权限
            </el-button>
          </el-row>
        </div>

        <!-- card body -->
        <!-- 渲染树形结构数据 -->
        <el-table border :data="list" row-key="id" default-expand-all>
          <el-table-column label="名称" prop="name" />
          <el-table-column label="标识" prop="code" />
          <el-table-column label="描述" prop="description" />
          <el-table-column label="操作">
            <template #default="{row}">
              <!-- 标识为1的时候添加顶级权限 -->
              <el-button v-if="row.type === 1" type="text" @click="openDialog(2, row.id)">添加</el-button>
              <el-button type="text" @click="openEditDialog(row.id)">编辑</el-button>
              <el-button type="text" @click="delPermission(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
    <!-- 权限添加弹窗 -->
    <el-dialog :visible.sync="showDialog" :title="formData.id?'编辑权限':'新增权限'" @close="close">
      <el-form ref="formRef" label-width="100px" :model="formData" :rules="rules">
        <el-form-item label="权限名称" prop="name">
          <el-input v-model="formData.name" />
        </el-form-item>
        <el-form-item label="权限标识">
          <el-input v-model="formData.code" />
        </el-form-item>
        <el-form-item label="权限描述">
          <el-input v-model="formData.description" />
        </el-form-item>
        <el-form-item label="权限启用">
          <el-switch
            v-model="formData.enVisible"
            active-text="启用"
            active-value="1"
            inactive-text="不启用"
            inactive-value="0"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div style="text-align: right;">
          <el-button @click="showDialog = false">取消</el-button>
          <el-button type="primary" @click="addPermission">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
// 权限数据列表
import { getPermissionList, addPermission, delPermission, getPermissionDetail, updatePermission } from '@/api/permission'
// 导入格式化树形结构
import { formatTreeData } from '@/utils/index'
export default {
  name: 'Permission',
  data() {
    return {
      // 权限弹窗控制
      showDialog: false,
      // 权限列表数据
      list: [],
      // 弹窗表单数据绑定
      formData: {
        enVisible: '1', // 默认权限开关开启
        name: '', // 名称
        code: '', // 权限标识
        description: '', // 描述
        type: '', // 类型
        pid: '' // 添加到哪个节点下
      },
      // 验证规则
      rules: {
        // 验证字段数组包含验证规则对象
        name: [
          { required: true, min: 2, max: 6, message: '名称至少2位,最多6位', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  created() {
    this.getPermissionList()
  },
  methods: {
    // 打开弹窗添加权限
    /**
     * type 权限点类型 1=》页面  2=》页面下的功能
     * pid 权限点添加到那里 =》 '0' =>系统页面权限 页面ID=》把功能点加到当前页面下
     */
    openDialog (type, pid) {
      this.showDialog = true
      this.formData.type = type
      this.formData.pid = pid
    },
    // 获取权限列表数据
    async getPermissionList() {
      const list = await getPermissionList()
      // console.table(list)
      this.list = formatTreeData(list)
    },
    // 关闭弹层清空数据
    close() {
      // 清空数据
      this.formData = {
        enVisible: '1', // 默认权限开关开启
        name: '', // 名称
        code: '', // 权限标识
        description: '', // 描述
        type: '', // 类型
        pid: '' // 添加到哪个节点下
      }

      // 只能清空有权限的数据
      this.$refs.formRef.resetFields()
    },
    // 新增权限
    addPermission () {
      this.$refs.formRef.validate(async isOk => {
        if (isOk) {
          if (this.formData.id) {
            await updatePermission(this.formData)
          } else {
            // 点击确定按钮通过校检新增权限
            await addPermission(this.formData)
          }
          // 提示用户更新成功
          this.$message.success('更新权限成功')
          // 刷新权限列表
          this.getPermissionList()
          // 关闭弹窗
          this.showDialog = false
        }
      })
    },
    // 删除权限
    delPermission(row) {
      // 删除前提醒用户删除操作
      this.$confirm('确定删除吗?', '提示').then(async() => {
        if (row.children && row.children.length) {
          this.$message.error('不能直接删除权限节点的父节点')
        } else {
          // 没有子可以直接删除
          // 确定进到这里
          await delPermission(row.id)
        }
        // 提示删除成功
        this.$message.success('删除成功')
        // 更新数据
        this.getPermissionList()
      }).catch(console.log)
    },
    // 回显弹层权限数据
    async openEditDialog(id) {
      const detail = await getPermissionDetail(id)
      this.formData = detail
      this.showDialog = true
    }

  }
}
</script>

<style lang="scss" scoped>
</style>
