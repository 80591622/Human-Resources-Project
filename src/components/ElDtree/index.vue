<template>
  <el-row v-show="isShow" type="flex" class="treeBox" justify="start">
    <el-tree
      :data="treeData"
      default-expand-all
      :props="{ label: 'name' }"
      @node-click="selectDepts"
    ></el-tree>
  </el-row>
</template>

<script>
import { getDepartments } from '@/api/departments'
import { formatTreeData } from '@/utils'
export default {
  name: 'ElDtree',
  props: {
    isShow: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      // 部门列表
      treeData: []
    }
  },
  created () {
    this.getTreeData()
  },
  methods: {
    // 获取供表单选择的部门数据
    async getTreeData () {
      const { depts } = await getDepartments()
      this.treeData = formatTreeData(depts)
    },
    // 选中部门执行
    selectDepts (node) {
      // 把选中部门数据传递给父组件
      this.$emit('current-selected', node)
      // 关闭选择组件
      this.$emit('update:isShow', false)
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
