<template>
  <div>
    <el-calendar v-model="value">
      <template #dateCell="{date,data}">
        <div class="date-content">
          <span class="text">{{ getDate(data.day) }}</span>
          <span v-if="getDay(date)" class="rest">休</span>
        </div>
      </template>
    </el-calendar>
  </div>
</template>

<script>

export default {
  name: 'CalendarWatch',
  data() {
    return {
      value: new Date()
    }
  },
  methods: {
    // 获取日子
    getDate(day) {
    // 切割格式化后的时间取索引为2的日
      return day.split('-')[2]
    },
    // 根据日期时间对象获取星期
    getDay(date) {
    // 获取星期几
      const day = date.getDay()
      return day === 6 || day === 0
    }
  }

}
</script>

<style lang="scss" scoped>
.select-box {
  display: flex;
  justify-content: flex-end;
}

::v-deep .el-calendar-day {
  height: 50px;
}
::v-deep
  .el-calendar-table__row
  td::v-deep
  .el-calendar-table
  tr
  td:first-child,
::v-deep .el-calendar-table__row td.prev {
  border: none;
}
.date-content {
  height: 40px;
  text-align: center;
  line-height: 40px;
  font-size: 14px;
}
.date-content .rest {
  color: #fff;
  border-radius: 50%;
  background: rgb(250, 124, 77);
  width: 20px;
  height: 20px;
  line-height: 20px;
  display: inline-block;
  font-size: 12px;
  margin-left: 10px;
}
.date-content .text {
  width: 20px;
  height: 20px;
  line-height: 20px;
  display: inline-block;
}
::v-deep .el-calendar-table td.is-selected .text {
  background: #409eff;
  color: #fff;
  border-radius: 50%;
}

</style>
