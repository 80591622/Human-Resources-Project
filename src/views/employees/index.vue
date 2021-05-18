<template>
  <div class="employees-container">
    <div class="app-container">
      <el-card shadow="always" :body-style="{ padding: '20px' }">
        <div slot="header">
          <PageTools>
            <!-- 插入到left插槽位置 -->
            <template #left>
              <span>总记录数：{{ total }}条</span>
            </template>
            <!-- 插入到right插槽位置 -->
            <template #right>
              <el-button type="warning" size="small" @click="$router.push('/import')">导入excel</el-button>
              <el-button type="danger" size="small" @click="exportData">导出excel</el-button>
              <el-button v-if="checkPonints('pem-add-user')" type="primary" size="small" @click="isShowDialog = true">新增员工</el-button>
            </template>
          </PageTools>
        </div>
        <div>
          <!-- table列表 -->
          <!-- 根据入职时间字段进行排序 :default-sort="{prop : 'workNumber'}"-->
          <el-table border :data="employess" :default-sort="{prop : 'workNumber', order: 'ascending'}">
            <el-table-column type="index" label="序号" />
            <el-table-column prop="username" label="姓名" />
            <!-- 头像展示 -->
            <el-table-column prop="staffphoto" label="头像">
              <template #default="{row}">
                <el-image :src="row.staffPhoto" class="staff" fit="fill" @click="clickShowCodeDialog(row.staffPhoto)"></el-image>
              </template>
            </el-table-column>
            <el-table-column prop="workNumber" label="工号" />
            <el-table-column prop="formOfEmployment" label="聘用形式">
              <!-- 作用域插槽 -->
              <template #default="{ row }">
                <span> {{ formatEmployment(row.formOfEmployment) }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="departmentName" label="部门" />
            <el-table-column prop="timeOfEntry" label="入职时间" sortable />
            <el-table-column label="账户状态">
              <el-switch v-model="actived"> </el-switch>
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="280">
              <template #default="{ row }">
                <el-button type="text" size="small" @click="$router.push(`/employees/detail/${row.id}`)">查看</el-button>
                <el-button type="text" size="small" @click="editRole(row.id)">分配角色</el-button>
                <el-button type="text" size="small" @click="delPerson(row.id)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页组件 -->
          <el-row type="flex" justify="center" align="middle" style="height: 60px">
            <el-pagination layout="prev, pager, next" :total="total" :current-page="pages.page" :page-size="pages.size" :page-sizes="[10, 2]" @current-change="changePage" />
          </el-row>
          <!-- 分配员工权组件 -->
        </div>
      </el-card>
    </div>

    <!-- 新增员工 -->
    <add-employee :is-show-dialog.sync="isShowDialog"></add-employee>

    <!-- 二维码组件 -->
    <el-dialog title="二维码" :visible="showCodeDialog" @close="showCodeDialog = false">

      <!-- 二维码 -->
      <el-row type="flex" justify="center">
        <canvas ref="myCanvas" />
      </el-row>
    </el-dialog>

    <!-- 分配角色权限组件 -->
    <assign-role ref="roleRef" :show-role-dialog.sync="showRoleDialog"></assign-role>
  </div>
</template>
<script>
// 导入插件
import PageTools from '@/components/PageTools'
// 导入 API
import { getEmployeeList, delEmployee } from '@/api/employees'
// 导入数据字典
import Els from '@/api/constant/employees'
// 引用弹窗子组件
import AddEmployee from './components/add-employee'
// 导入二维码插件
import QrCode from 'qrcode'
// 导入分配角色权限组件
import AssignRole from './components/AssignRole'
export default {
  components: {
    PageTools,
    AddEmployee,
    AssignRole
  },
  data () {
    return {
      // 展示隐藏分配角色组件
      showRoleDialog: false,
      // 二维码展示隐藏
      showCodeDialog: false,
      // 定义显示隐藏弹窗变量
      isShowDialog: false,
      // 员工数据
      employess: [],
      pages: {
        // 默认页码
        page: 1,
        // 每页条数
        size: 10
      },
      total: 5,
      actived: true

    }
  },
  created () {
    this.getEmployeeList()
    this.formatEmployment()
  },
  methods: {
    // 分配角色
    editRole (id) {
      this.showRoleDialog = true
      this.$refs.roleRef.getSelectedRole(id)
    },
    // 点击头像展示头像弹层二维码
    clickShowCodeDialog(url) {
      if (!url) return // 有图片才显示弹层
      this.showCodeDialog = true
      this.$nextTick(() => {
        // 如果这里 url 写的是网址, 就会跳转到对应网址 (二维码分享效果)
        QrCode.toCanvas(this.$refs.myCanvas, 'https://xiao-wang-1305861549.cos.ap-beijing.myqcloud.com/2.jpg')
      })
    },
    // 导出表格
    async exportData() {
      const excel = await import('@/utils/Export2Excel.js')
      console.log('获取js模块对外导出的方法', excel)
      // 需要导出数据的映射关系 => 顺序一定要和后端提供的数据字段顺序一致
      const ships = {
        '手机号': 'mobile',
        '姓名': 'username',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '工号': 'workNumber',
        '转正日期': 'correctionTime',
        '部门': 'departmentName'
      }
      // 表头
      const header = Object.keys(ships) // ['手机号','姓名'....]
      // 数据
      const data = this.transformExcelData(this.employess, Object.values(ships))
      // 调用模块方法中导出的 json 数据
      excel.export_json_to_excel({
        // 表头字段
        header,
        // excel 导出的数据
        data,
        filename: 'testExcel', // 导出下载的文件名
        autoWidth: true, // 导出excel列宽度是否自适应
        bookType: 'xlsx' // 导出生成的文件类型
      })
    },
    // 转换导出当前页数据的二维数组
    /**
     * list: 当前页的员工数据
     * header: 导出字段 ['mobile','username',...]
     * 1. 准备空数组存储结果
     * 2. 循环遍历数据放入二维数组
     * 3. 返回转换结果
     */
    transformExcelData (list, headers) {
      const parentArray = []
      list.forEach(item => {
        // item 员工信息对象
        const childArray = []
        for (const key in item) {
          // 根据 header 过滤需要导入的字段
          if (headers.includes(key)) {
            if (key === 'formOfEmployment') {
              // 处理聘用关系转换数字
              childArray.push(this.formatEmployment(item[key]))
            } else {
              // 存在加入值
              childArray.push(item[key])
            }
          }
        }
        parentArray.push(childArray)
      })
      return parentArray
    },
    // 关闭弹窗
    closeDialog () {
      this.isShowDialog = false
    },
    // 点击分页组件切换当前页
    changePage (newPage) {
      // 点击切换当前页
      this.pages.page = newPage
      // 更新数据
      this.getEmployeeList()
    },
    // 每页显示条数切换
    sizeChange (sizes) {
      // console.log(sizes)
      this.pages.size = sizes
      this.getList()
    },
    // 员工列表数据
    async getEmployeeList () {
      const { total, rows } = await getEmployeeList(this.pages)
      // console.table(rows)
      this.employess = rows
      this.total = total
    },
    // 删除员工
    delPerson (id) {
      this.$confirm('确认删除吗？', '提示').then(async () => {
        // 确认
        console.log('确认')
        await delEmployee(id)
        this.$message.success('删除成功')
        /**
         * 解决问题：如果把最后一页数据删完了，页码显示正确的，但数据不对
         * 为什么不对？：最后一页没有数据了
         * 思路：
         * 1. 删除以后重新计算总页数=> total = (total-1)/pagesize
         * 2. 根据总页数和当前页码对比=》如果大于总页数=》向前进一页
         * 3. 如果数据删完了=》默认页码是1
         */
        const newTotal = Math.ceil((this.total - 1) / this.pages.size)
        // 比方说：newTotal = 8 ，但是this.pages.page = 9 =》需要改为最新的页码
        if (newTotal > 0) {
          this.pages.page = this.pages.page > newTotal ? newTotal : this.pages.page
        }

        this.getEmployeeList()
      }).catch(console.log)
    },

    // 处理聘用关系转换文字
    formatEmployment (id) {
      /**
       * 思路：
       * 1. map对象=》存储字典映射关系数据
       * 2. 根据id获取字典数据
       */
      const maps = {}
      Els.hireType.forEach(item => {
        maps[item.id] = item.value
      })
      // debugger
      // console.log(maps)
      return maps[id]
    }
  }

}
</script>
<style lang="scss">
  .staff {
    width: 80px;
    height: 80px;
    border-radius: 100%;
  }
</style>
