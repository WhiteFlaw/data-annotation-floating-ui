<!--
* @FileDescription: 查询条件组件
* @Author: Yu Yang
* @Date: 2023-06-12
-->
<template>
  <el-row>
    <el-col :span="22">
      <el-form :model="searchCondition" inline class="search-form">
        <el-form-item v-if="isHasDate" label="时间范围">
          <el-date-picker v-model="dateTime" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss" />
        </el-form-item>
        <el-form-item v-if="isHasProjectName" label="项目名称">
          <el-input v-model="searchCondition.projectName" placeholder="请输入项目名称" clearable />
        </el-form-item>
        <el-form-item v-if="isHasTeamName" label="团队名称">
          <el-input v-model="searchCondition.teamName" placeholder="请输入团队名称" clearable />
        </el-form-item>
        <el-form-item v-if="isHasAnnotatorName" label="标注员名称">
          <el-input v-model="searchCondition.annotatorName" placeholder="请输入标注员名称" clearable />
        </el-form-item>
        <el-form-item v-if="isHasTaskName" label="任务名称">
          <el-input v-model="searchCondition.taskName" placeholder="请输入任务名称" clearable />
        </el-form-item>
        <el-form-item v-if="isHasWorkName" label="作业名称">
          <el-input v-model="searchCondition.workName" placeholder="请输入作业名称" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchData">查询</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <el-col :span="2" class="button-group">
      <el-button type="primary" @click="excelData">导出</el-button>
    </el-col>
  </el-row>
</template>

<script>

export default {
  name: 'SearchCondition',
  props: {
    isHasDate: { type: Boolean, default: false }, // 是否显示时间范围
    isHasProjectName: { type: Boolean, default: false }, // 是否显示项目名称
    isHasTeamName: { type: Boolean, default: false }, // 是否显示团队名称
    isHasAnnotatorName: { type: Boolean, default: false }, // 是否显示标注员名称
    isHasTaskName: { type: Boolean, default: false }, // 是否显示任务名称
    isHasWorkName: { type: Boolean, default: false } // 是否显示作业名称
  },
  data() {
    return {
      searchCondition: {
        startTime: '', // 开始日期
        endTime: '', // 结束日期
        projectName: '', // 项目名称
        teamName: '', // 团队名称
        annotatorName: '', // 标注员名称
        taskName: '', // 任务名称
        workName: '' // 作业名称
      },
      dateTime: [this.getLocalDate(), this.getLocalDate()]
    }
  },
  methods: {
    // 当前日期
    getLocalDate() {
      const dateTime = new Date()
      const year = dateTime.getFullYear()
      const month = ('0' + (dateTime.getMonth() + 1)).slice(-2)
      const day = ('0' + dateTime.getDate()).slice(-2)
      return year + '-' + month + '-' + day + ' 00:00:00'
    },
    // 查询条件
    searchData() {
      if (this.dateTime) {
        this.searchCondition.startTime = this.dateTime[0]
        this.searchCondition.endTime = this.dateTime[1]
      } else {
        this.searchCondition.startTime = ''
        this.searchCondition.endTime = ''
      }
      const condition = { ...this.searchCondition }
      if (!this.isHasDate) {
        delete condition['startTime']
        delete condition['endTime']
      }
      if (!this.isHasProjectName) {
        delete condition['projectName']
      }
      if (!this.isHasTeamName) {
        delete condition['teamName']
      }
      if (!this.isHasAnnotatorName) {
        delete condition['annotatorName']
      }
      if (!this.isHasTaskName) {
        delete condition['taskName']
      }
      if (!this.isHasWorkName) {
        delete condition['workName']
      }
      this.$emit('search-data', condition)
    },
    // 导出数据
    excelData() {
      this.$emit('excel-data')
    }
  }
}
</script>

<style scoped lang="scss">
.button-group {
  text-align: right;
}
</style>
