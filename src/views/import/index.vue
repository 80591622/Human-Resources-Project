<template>
  <div class="app-container">
    <el-card shadow="always" :body-style="{ padding: '20px' }">
      <div slot="header">
        <span>员工批量导入</span>
      </div>
      <!-- card body -->
      <!-- 导入组件 -->
      <UploadExcel :before-upload="beforeUpload" :on-success="onSuccess" />
    </el-card>
  </div>
</template>

<script>
import { formatExcelDate } from '@/utils'
import { importEmployees } from '@/api/employees.js'
export default {
  methods: {
    beforeUpload (file) {
      console.log(file)
      // 作用：校验格式和大小
      //  校验通过返回true才会继续执行
      return true
    },
    async onSuccess (res) {
      // 校验通过=》获取Excel里的数据
      console.log('读取excel的数据：', res)
      // 调用接口上传 Excel 读到的所有员工数据
      console.table(this.transfromKeys(res.results))
      await importEmployees(this.transfromKeys(res.results))
      this.$message.success('导入成功')
      // 返回上一个页面
      this.$router.back()
    },
    // 导入人员信息中文key转换为英文
    transfromKeys (excelResuls) {
      // 中英对照表
      const userRelations = {
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '手机号': 'mobile',
        '姓名': 'username',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      // 准备一个空数组,存储转换结果
      const newArr = []
      // elm 导入人员信息对象
      excelResuls.forEach(elm => {
        // 准备一个空对象存储转换的员工信息对象
        const userEnInfo = {}
        // 转换中文 key
        for (const zhKey in elm) {
          // 获取英文 key
          const enKey = userRelations[zhKey]
          // 解决 Excel 时间错误,做转换
          if (enKey === 'timeOfEntry' || enKey === 'correctionTime') {
            userEnInfo[enKey] = formatExcelDate(elm[zhKey])
          } else {
            userEnInfo[enKey] = elm[zhKey]
          }
        }
        newArr.push(userEnInfo)
      })
      return newArr
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
