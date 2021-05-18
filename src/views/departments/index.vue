<template>
  <div class="department-container">
    <div class="app-container">
      <el-card
        shadow="always"
        :body-style="{ padding: '20px' }"
      >
        <!-- card title -->
        <div slot="header">
          <!-- 用一个行列布局 -->
          <el-row>
            <el-col :span="20">
              <span>{{ companyInfo.name }}</span>
            </el-col>
            <el-col :span="4">
              <el-row
                type="flex"
                justify="end"
              >
                <!-- 两个内容 -->
                <el-col>{{ companyInfo.message }}</el-col>
                <!-- 下拉菜单 element -->
                <el-col>
                  <el-dropdown>
                    <span> 操作<i class="el-icon-arrow-down" /> </span>
                    <el-dropdown-menu slot="dropdown">
                      <!-- 公司下添加子部门 -->
                      <el-dropdown-item @click.native="addPart()">添加子部门</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </div>
        <!-- card body -->
        <div>
          <!-- 放置一个el-tree组件 -->
          <el-tree
            :data="partsData"
            :props="defaultProps"
            :default-expand-all="true"
            @node-click="handleNodeClick"
          >
            <!-- 自定义内容树 -->
            <template #default="{ data }">
              <el-row style="width: 100%;">
                <el-col :span="20">
                  <span>{{ data.name }}</span>
                </el-col>
                <el-col :span="4">
                  <el-row
                    type="flex"
                    justify="end"
                  >
                    <!-- 两个内容 -->
                    <el-col>{{ data.manager }}</el-col>
                    <el-col>
                      <!-- 下拉菜单 element -->
                      <el-dropdown>
                        <span> 操作<i class="el-icon-arrow-down" /> </span>
                        <!-- 下拉菜单 -->
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item @click.native="addPart(data)">添加子部门</el-dropdown-item>
                          <el-dropdown-item @click.native="editPart(data)">编辑部门</el-dropdown-item>
                          <el-dropdown-item @click.native="delPart(data)">删除部门</el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </template>
          </el-tree>
        </div>
      </el-card>
    </div>
    <!-- 编辑弹层 -->
    <Add-Dept
      ref="addDepart"
      :is-show-dialog.sync="isShowDialog"
      :current-data="currentData"
      :parts-data-all="partsDataAll"
      @updata-tree="getParts"
    ></Add-Dept>
  </div>
</template>

<script>
import { getDepartments, delDepartments } from '@/api/departments'
// 导入封装的格式化属性结构
import { formatTreeData } from '@/utils/index'
// 导入子组件
import AddDept from '@/views/departments/components/add-dept'
export default {
  // 注册子组件
  components: {
    AddDept
  },
  data () {
    return {
      // 当前操作的部门数据
      currentData: null,
      // 控制弹层显示
      isShowDialog: false,
      // 完整部门数据(未格式化的)
      partsDataAll: [],
      // 部门数据(格式化后的)
      partsData: [],
      // 公司信息
      companyInfo: { name: '', message: 'CEO' },
      // 自定义数据段的名称
      defaultProps: {
        label: 'name',
        children: 'children'
      }
    }
  },
  // 生命周期调用接口
  created () {
    this.getParts()
  },
  methods: {
    /**
     * 点击部门节点触发
     * data 当前部门节点数据
     */
    handleNodeClick (data) {
      // console.log(data)
    },

    // 获取部门数据
    async getParts () {
      const parts = await getDepartments()
      // console.log(parts)
      // console.table(parts.depts)
      // 未格式化的完整公司数据
      this.partsDataAll = parts.depts
      // 绑定公司信息
      this.companyInfo.name = parts.companyName
      // 绑定部门数据
      // this.partsData = parts.depts
      this.partsData = formatTreeData(parts.depts)
    },
    // 显示隐藏弹层
    handleClose (flag) {
      this.isShowDialog = flag
    },
    // 删除部门数据
    delPart (data) {
      this.$confirm('你确认要进行删除么?', '温馨提示')
        .then(async () => {
          if (data.children && data.children.length) {
            return this.$message.error('不能直接删除父节点！')
          }
          // 删除操作成功
          await delDepartments(data.id)
          // 添加提示
          this.$message.success('删除操作成功')
          // 更新数据
          this.getParts()
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 添加部门数据
    addPart (data) {
      // 展示弹框
      this.isShowDialog = true
      // 记录当前点击的data
      this.currentData = data
      // console.log(data)
    },
    // 编辑部门数据
    editPart (data) {
      // 1.打开弹窗
      this.isShowDialog = true
      // 2.记录当前操作的部门数据
      this.currentData = data
      // 3.通知子组件进行数据回显
      this.$refs.addDepart.hGetDepartDetail(data.id)
    }
  }
}
</script>

<style lang="scss" scoped>
// ::v-deep 是 scss中的深度作用符
::v-deep .el-tree-node__content {
  margin: 3px 0;
  font-size: 14px;
}
</style>
