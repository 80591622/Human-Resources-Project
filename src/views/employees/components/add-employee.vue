<template>
  <!-- 弹窗子组件 -->
  <div>
    <el-dialog title="新增员工" :visible="isShowDialog" @close="closeDialog">
      <!-- 表单 -->
      <el-form ref="form" label-width="120px" :model="formData" :rules="rules">
        <el-form-item label="姓名" prop="username">
          <el-input v-model="formData.username" style="width:50%" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="formData.mobile" style="width:50%" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="入职时间" prop="timeOfEntry">
          <el-date-picker v-model="formData.timeOfEntry" style="width:50%" placeholder="请选择入职时间" />
        </el-form-item>
        <el-form-item label="聘用形式" prop="formOfEmployment">
          <el-select v-model="formData.formOfEmployment" style="width:50%" placeholder="请选择">
            <!-- 聘用形式字典数据 -->
            <el-option v-for="item in types" :key="item.id" :label="item.value" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工号" prop="workNumber">
          <el-input v-model="formData.workNumber" style="width:50%" placeholder="请输入工号" />
        </el-form-item>
        <el-form-item label="部门" prop="departmentName">
          <el-input v-model="formData.departmentName" style="width:50%" placeholder="请选择部门" @focus="isShowTree=true" />
          <!-- 显示可选择的部门 -->
          <el-row v-show="isShowTree" type="flex" justify="start" class="treeBox">
            <el-tree :data="treeData" :props="{label:'name'}" default-expand-all @node-click="selectDepts" />
          </el-row>
        </el-form-item>
        <el-form-item label="转正时间" prop="correctionTime">
          <el-date-picker v-model="formData.correctionTime" style="width:50%" placeholder="请选择转正时间" />
        </el-form-item>
      </el-form>
      <!-- footer插槽 -->
      <template v-slot:footer>
        <el-button @click="this.$emit('update:isShowDialog', false)">取消</el-button>
        <el-button type="primary" @click="addElm">确定</el-button>
      </template>
    </el-dialog>
  </div>

</template>

<script>
// 导入数据字典
import Els from '@/api/constant/employees'
// 获取部门节点
import { getDepartments } from '@/api/departments.js'
// 导入格式化数据算法
import { formatTreeData, parseTime } from '@/utils'
// 导入新增员工
import { addEmployee } from '@/api/employees.js'
export default {
  props: {
    isShowDialog: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      // 控制部门选择隐藏
      isShowTree: false,
      // 聘用形式(非正式,正式)
      types: Els.hireType,
      // 部门数据
      treeData: [],
      // 表单数据
      formData: {
        username: '', // 用户名
        mobile: '', // 手机号
        timeOfEntry: '', // 入职时间
        formOfEmployment: '', // 聘用形式
        workNumber: '', // 工号
        departmentName: '', // 部门
        correctionTime: '' // 转正时间
      },
      // 验证字段
      rules: {
        username: [
          { required: true, message: '用户姓名不能为空', trigger: ['blur', 'change'] },
          { min: 1, max: 4, message: '用户姓名为1-4位', trigger: ['blur', 'change'] }
        ],
        mobile: [
          { required: true, message: '手机号不能为空', trigger: ['blur', 'change'] },
          { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: ['blur', 'change'] }
        ],
        formOfEmployment: [
          { required: true, message: '聘用形式不能为空', trigger: ['blur', 'change'] }
        ],
        workNumber: [
          { required: true, message: '工号不能为空', trigger: ['blur', 'change'] }
        ],
        departmentName: [
          { required: true, message: '部门不能为空', trigger: ['blur', 'change'] }
        ],
        timeOfEntry: [
          { required: true, message: '请选择入职时间', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  created () {
    this.getTreeData()
  },
  methods: {
    // 新增员工
    addElm () {
      this.$refs.form.validate(async (isOk) => {
        if (isOk) {
          // 表单数据整体校检通过执行
          // 提交之前处理入职时间el-date-picker组件选择的时间
          this.formData.timeOfEntry = parseTime(this.formData.timeOfEntry, '{y}-{m}-{d}')
          // 处理转正时间
          if (this.formData.correctionTime) {
            this.formData.correctionTime = parseTime(this.formData.correctionTime, '{y}-{m}-{d}')
          }
          // 获取表单新增员工数据
          await addEmployee(this.formData)
          // 成功后提示
          this.$message.success('添加员工成功')
          // 调用父组件员工列表数据
          this.$parent.getEmployeeList()
          // 关闭弹窗
          this.closeDialog()
        }
      })
    },
    // 关闭弹层
    closeDialog () {
      this.$emit('update:isShowDialog', false)
      // 没有经过校验的字段需要手动清空
      this.formData.correctionTime = ''
      this.$refs.form.resetFields()
    },
    // 下拉选择部门数据
    async getTreeData () {
      const { depts } = await getDepartments()
      this.treeData = formatTreeData(depts)
    },
    // 选择部门
    selectDepts (node) {
      // console.log(node)
      // 选择部门
      this.formData.departmentName = node.name
      // 隐藏部门数据
      this.isShowTree = false
    }
  }
}
</script>
<style lang="scss" scoped>
.treeBox {
  width: 280px;
  border: 1px solid #eee;
}
</style>
