<template>
  <div class="employees-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="登录账户设置">
            <Account-Set :user-data="userData"></Account-Set>
          </el-tab-pane>
          <el-tab-pane label="个人详情">
            <Account-Detail :user-data="userData"></Account-Detail>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>
<script>
import AccountSet from './components/account-set'
import AccountDetail from './components/account-detail'
// 导入获取信息 API
import { getUserDetailById } from '@/api/user.js'
export default {
  name: 'Detail',
  components: {
    AccountSet,
    AccountDetail
  },
  data() {
    return {
      // 用户信息
      userData: {}
    }
  },
  created() {
    this.getUserData()
  },
  methods: {
    // 获取用户信息传递给子组件
    async getUserData() {
      const userData = await getUserDetailById(this.$route.params.id)
      console.log(userData)
      this.userData = userData
    }
  }
}
</script>
<style lang="scss">

</style>
