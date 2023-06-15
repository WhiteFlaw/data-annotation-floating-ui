<!--
* @FileDescription: 工作台-项目列表
* @Author: Gu Xunqin
* @Date: 2023-04-25
-->
<template>
  <el-table v-loading="tableLoading" :data="tableData" border stripe highlight-current-row :max-height="tableMaxHeight">
    <el-table-column align="center" prop="name" label="项目名称" min-width="150" />
    <el-table-column align="center" prop="status" label="项目状态" min-width="100">
      <template slot-scope="scope">
        <el-tag :type="scope.row.status === 3 ? 'success' : ''">{{ changeProjectStatus(scope.row.status) }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column align="center" label="项目进度" min-width="350">
      <template slot-scope="scope">
        <span class="el-progress-class progress-container">
          <span class="progress-label">待领取：</span>
          <el-progress
            :percentage="
              scope.row.taskCount ? (scope.row.taskCount !== 0 ? Number((((scope.row.toBeClaimedCount || 0) / scope.row.taskCount) * 100).toFixed(2)) : 0) : 0
            "
            :format="progressBarText(scope.row.toBeClaimedCount, scope.row.taskCount)" />
        </span>
        <span class="el-progress-class progress-container">
          <span class="progress-label">标注中：</span>
          <el-progress
            :percentage="
              scope.row.taskCount ? (scope.row.taskCount !== 0 ? Number((((scope.row.allAnnotatedCount || 0) / scope.row.taskCount) * 100).toFixed(2)) : 0) : 0
            "
            :format="progressBarText(scope.row.allAnnotatedCount, scope.row.taskCount)" />
        </span>
        <span class="el-progress-class progress-container">
          <span class="progress-label">一检：</span>
          <el-progress
            :percentage="
              scope.row.taskCount
                ? scope.row.taskCount !== 0
                  ? Number((((scope.row.firstInspectionCount || 0) / scope.row.taskCount) * 100).toFixed(2))
                  : 0
                : 0
            "
            :format="progressBarText(scope.row.firstInspectionCount, scope.row.taskCount)" />
        </span>
        <span class="el-progress-class progress-container">
          <span class="progress-label">二检：</span>
          <el-progress
            :percentage="
              scope.row.taskCount
                ? scope.row.taskCount !== 0
                  ? Number((((scope.row.secondInspectionCount || 0) / scope.row.taskCount) * 100).toFixed(2))
                  : 0
                : 0
            "
            :format="progressBarText(scope.row.secondInspectionCount, scope.row.taskCount)" />
        </span>
        <span class="el-progress-class progress-container">
          <span class="progress-label">待验收：</span>
          <el-progress
            :percentage="
              scope.row.taskCount ? (scope.row.taskCount !== 0 ? Number((((scope.row.atCount || 0) / scope.row.taskCount) * 100).toFixed(2)) : 0) : 0
            "
            :format="progressBarText(scope.row.atCount, scope.row.taskCount)" />
        </span>
      </template>
    </el-table-column>
    <el-table-column v-if="roles.indexOf('manager') !== -1 || roles.indexOf('teamLeader') !== -1" align="center" label="操作" min-width="150">
      <template slot-scope="scope">
        <el-button type="text" @click="toProjectDetail(scope.row)">项目详情</el-button>
        <el-button v-if="roles.indexOf('manager') !== -1" type="text" @click="openDetailsPage(scope.row, 'manager', scope.row.taskCount)">团队详情</el-button>
        <el-button v-if="roles.indexOf('teamLeader') !== -1" type="text" @click="openDetailsPage(scope.row, 'teamLeader', scope.row.taskCount)">成员列表</el-button>
        <el-button type="text" @click="recordOfRejection(scope.row, scope.row.taskCount)">驳回记录</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import tableMixin from '@/utils/tableMixin'
import { mapGetters } from 'vuex'

export default {
  name: 'ItemList',
  mixins: [tableMixin],
  props: {
    tableLoading: {
      default: false,
      type: Boolean
    },
    tableData: {
      default: () => [],
      type: Array
    }
  },
  computed: {
    ...mapGetters(['roles'])
  },
  mounted() {
    this.initPageData()
  },
  methods: {
    initPageData() {
      // 初始化
      this.getTableMaxHeight()
    },
    progressBarText(val1, val2) {
      // 进度条文字
      return () => {
        return (val1 || 0) + '/' + (val2 || 0) + '(' + (Number(val2) !== 0 ? Number((((val1 || 0) / val2) * 100).toFixed(2)) : 0) + '%)'
      }
    },
    changeProjectStatus(val) {
      // 判断项目状态
      let status
      switch (val) {
        case 0:
          status = '未领取'
          break
        case 1:
          status = '进行中'
          break
        case 2:
          status = '验收中'
          break
        case 3:
          status = '已完成'
          break
        default:
          status = ''
      }
      return status
    },
    openDetailsPage(val1, val2, val3) {
      // 打开成员列表
      this.$emit('open-details-page', val1, val2, val3)
    },
    recordOfRejection(val1, val2) {
      this.$emit('open-record-of-rejection', val1, val2)
    },
    // 跳转项目详情
    toProjectDetail(row) {
      this.$router.push({ name: 'DashboardProjectDetails', query: { id: row.id } })
    }
  }
}
</script>

<style scoped lang="scss"></style>
