<template>
  <div class="app-container">
    <!-- 放置表单 -->
    <el-form ref="formRef" label-width="60px" :model="userData" :rules="rules">
      <el-form-item label="姓名:" prop="username">
        <el-input v-model="userData.username" style="width: 300px" />
      </el-form-item>
      <el-form-item label="手机号:">
        <el-input v-model="userData.mobile" disabled style="width: 300px" />
      </el-form-item>
      <el-form-item label="密码:">
        <el-input v-model="userData.password" disabled type="password" style="width: 300px" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveUserInfo">更新</el-button>
        <el-button @click="$router.back()">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { saveUserDetailById } from '@/api/user.js'
export default {
  name: 'AccountSet',
  props: {
    // 从父组件中传递过来的数据
    userData: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      // 验证字段
      rules: {
        // 用户名验证
        username: [
          { required: true, min: 2, max: 4, message: '用户名最小2位最大4位', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    saveUserInfo() {
      this.$refs.formRef.validate(async (isOk) => {
        if (isOk) {
          // 更新信息
          await saveUserDetailById(this.userData)
          // 更新成功
          this.$message.success('更新成功')
        }
      })
    }
  }

}
</script>
<style lang="scss">

</style>
