<template>
  <div>
    <!-- 放置弹层组件 -->
    <!-- :visible 弹层是否显示 :title 弹层标题  @close 关闭弹层时执行-->
    <el-dialog :title="form.id?'编辑部门':'新增部门'" :visible="isShowDialog" @close="handleCloseDialog">
      <el-form ref="form" label-width="120px" :model="form" :rules="rules">
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="form.name" style="width:80%" placeholder="1-50个字符" />
        </el-form-item>
        <el-form-item label="部门编码" prop="code">
          <el-input v-model="form.code" style="width:80%" placeholder="1-50个字符" />
        </el-form-item>
        <el-form-item label="部门负责人" prop="manager">
          <el-select v-model="form.manager" style="width:80%" placeholder="请选择">
            <!-- 弹窗员工数据 -->
            <!-- `label`选项显示的值；`value`选项选中被保存的值 -->
            <el-option v-for="item in managerList" :key="item.id" :label="item.username" :value="item.username"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门介绍" prop="introduce">
          <el-input v-model="form.introduce" style="width:80%" placeholder="1-300个字符" type="textarea" :rows="3" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" size="small" @click="clickSubmit">{{ form.id?"更新":"确定" }}</el-button>
        <el-button size="small" @click="handleCloseDialog">取消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
// 导入表单接口
import { getEmployeeSimple } from '@/api/employees'
import { getDepartDetail, updateDepartments, addDepartments } from '@/api/departments.js'
export default {
  // 接收父组件传递的数据,控制弹窗是否显示
  props: {
    // 控制弹层是否显示
    isShowDialog: {
      type: Boolean,
      default: false
    },
    // 当前操作部门数据
    currentData: {
      type: Object,
      // 默认传值对象类型防止未传值报错
      default: () => ({})
    },
    // 没有格式化的所有部门数据
    partsDataAll: {
      type: Array,
      default: () => []
    }
  },
  data () {
    // 校验部门ID不能有重复的
    /**
     * 需求：新增的部门编码不能和已有部门编码一样
     * rule 规则
     * value 当前输入的值
     * cb 是否通过校验
     */
    const validateCode = (rule, value, cb) => {
      /**
       * 根据id判断是编辑字段还是新增字段
       */
      let flag
      if (this.form.id) {
        flag = this.partsDataAll.some(item => { item.code === value && value !== this.currentData.code })
      } else {
        flag = this.partsDataAll.some(item => { item.code === value })
      }

      // some 方法根据传入的表达式=》如果匹配到就返回true,相反返回false
      if (flag) {
        //  匹配到有重复=>验证失败
        cb(new Error('部门编码重复了！换一个！'))
      } else {
        //  没有匹配到
        // 验证通过
        cb()
      }
    }
    return {
      // 表单数据
      form: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      },
      // 验证字段
      rules: {
        name: [
          { required: true, message: '部门名称不能为空', trigger: ['blur', 'change'] },
          { min: 1, max: 50, message: '部门名称要求1-50个字符', trigger: ['blur', 'change'] }
        ],
        code: [
          { required: true, message: '部门编码不能为空', trigger: ['blur', 'change'] },
          { min: 1, max: 50, message: '部门编码要求1-50个字符', trigger: ['blur', 'change'] },
          { validator: validateCode, trigger: ['blur', 'change'] }
        ],
        manager: [
          { required: true, message: '部门负责人不能为空', trigger: ['blur', 'change'] }
        ],
        introduce: [
          { required: true, message: '部门介绍不能为空', trigger: ['blur', 'change'] },
          { min: 1, max: 300, message: '部门介绍要求1-300个字符', trigger: ['blur', 'change'] }
        ]
      },
      // 部门负责人列表
      managerList: []

    }
  },
  // 生命周期挂载
  created () {
    this.getManagerList()
  },
  methods: {
    // 关闭弹层触发
    handleCloseDialog () {
      console.log('弹层关闭了')
      // 清除校检数据
      this.$refs.form.resetFields()
      // 通知父组件关闭弹层
      // 要点：1. update:固定写法 2. isShowDialog父组件传递的props数据名
      this.$emit('update:isShowDialog', false)
    },
    // 部门负责人列表
    async getManagerList () {
      const managerList = await getEmployeeSimple()
      this.managerList = managerList
      // console.log(managerList)
    },
    // 点击提交
    clickSubmit () {
      // 提交整体校检 isOk: 校检是否全部通过
      this.$refs.form.validate(async (isOk) => {
        if (isOk) {
          // 调用接口新增部门
          console.info('表单校检通过了')
          if (this.form.id) {
            // 调用更新接口
            await updateDepartments(this.form)
          } else {
            // 新增
            // 数据库新增部门,pid是当前添加部门的父部门,如果是控就是顶级部门
            await addDepartments({ ...this.form, pid: this.currentData.id || '' })
          }
          this.$message.success('操作成功')
          // 刷新部门列表,子传父
          this.$emit('updata-tree')
          // 关闭弹层
          this.handleCloseDialog()
        }
      })
    },
    // 获取部门数据
    async hGetDepartDetail (id) {
      const detail = await getDepartDetail(id)
      this.form = detail
    }

  }
}
</script>

<style lang="scss" scoped>
</style>
