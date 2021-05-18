<template>
  <div class="app-container">
    <!-- 个人信息 -->
    <el-form ref="form" label-width="100px" :model="userData" :rules="rules">
      <!--手机 聘用形式  -->
      <el-row class="inline-info">
        <el-col :span="12">
          <el-form-item label="部门" prop="departmentName">
            <el-input v-model="userData.departmentName" @focus="isShowTree = true" />
            <!-- 部门树选择组件 -->
            <el-depets
              class="meng"
              style="width: 270px"
              :is-show-tree.sync="isShowTree"
              @current-selected="deptSel"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 工号 入职时间 -->
      <el-row class="inline-info">
        <el-col :span="12">
          <el-form-item label="入职时间" prop="timeOfEntry">
            <el-date-picker
              v-model="userData.timeOfEntry"
              type="date"
              class="inputW"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 员工照片 -->
      <el-row class="inline-info">
        <el-col :span="12">
          <el-form-item label="员工头像">
            <!-- 放置上传图片 -->
            <!-- <el-image :src="require('@/assets/common/head.jpg')"></el-image> -->
            <!-- 封装的公共上传头像组件 -->
            <upload-photo :photo.sync="userData.staffPhoto"></upload-photo>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 保存个人信息 -->
      <el-row class="inline-info" type="flex" justify="center">
        <el-col :span="12">
          <el-button type="primary" @click="updateInfo">保存更新</el-button>
          <el-button @click="$router.back()">返回</el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import { saveUserDetailById } from '@/api/user'
export default {
  name: 'AccountDetail',
  props: {
    // 从父组件中传递过来的数据
    userData: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      isShowTree: false,
      rules: {
        departmentName: [
          { required: true, message: '部门不能为空', trigger: ['blur', 'change'] }
        ],
        timeOfEntry: [
          { required: true, message: '请选择入职时间', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  methods: {
    // 选择部门
    deptSel (node) {
      this.userData.departmentName = node.name
    },
    updateInfo () {
      this.$refs.form.validate(async flag => {
        if (!flag) return
        // 使用最新修改数据覆盖源数据 作为接口提交数据
        await saveUserDetailById(this.userData)
        this.$message.success('更新成功')
      })
    }
  }

}
</script>
<style lang="scss">

</style>
