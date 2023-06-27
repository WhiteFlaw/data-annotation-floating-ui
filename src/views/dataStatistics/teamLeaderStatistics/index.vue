<!--
* @FileDescription: teamLeader 数据列表
* @Author: Wu Zixuan
* @Date: 2023-06-16
-->
<template>
  <PageContainer has-search>
    <template slot="search">
      <el-form>
        <el-form-item label="团队名称">
          <el-select v-model="teamNameId" placeholder="请选择" @change="getTeam">
            <el-option
              v-for="item in teamListOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id" />
          </el-select>
        </el-form-item>
      </el-form>
      <search-condition v-show="showPageData" ref="childRef" :is-search-condition.sync="searchCondition" :is-has-inspector="activeName !== 'teamListData'" is-has-date is-has-project-name :is-has-user-nickname="activeName === 'teamListData'" @search-data="searchData" @excel-data="excelData" />
    </template>
    <template v-if="showPageData" slot="content">
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="标注" name="teamListData" />
        <el-tab-pane label="一检" name="firsInspection" />
        <el-tab-pane label="二检" name="secondInspection" />
      </el-tabs>
      <el-table
        v-if="activeName === 'teamListData'"
        v-loading="tableLoading"
        :data="tableData"
        style="width: 100%"
        :max-height="tableMaxHeight"
        border
        stripe
        highlight-current-row
      >
        <el-table-column label="序号" width="100" align="center" type="index" />
        <el-table-column prop="projectName" label="项目名称" min-width="180" align="center" />
        <el-table-column prop="userNickname" label="标注员姓名" min-width="180" align="center" />
        <el-table-column prop="taskCount" label="任务数量" min-width="180" align="center" />
        <el-table-column prop="boxCount" label="标注总框数" min-width="180" align="center" />
        <el-table-column prop="checkRejectCount" label="一检驳回次数" min-width="180" align="center" />
        <el-table-column label="操作" min-width="180" align="center">
          <template slot-scope="scope">
            <el-button v-if="activeName === 'teamListData'" type="text" @click="details(scope.row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-table
        v-else
        v-loading="tableLoading"
        :data="tableData"
        style="width: 100%"
        :max-height="tableMaxHeight"
        border
        stripe
        highlight-current-row
      >
        <el-table-column label="序号" width="100" align="center" type="index" />
        <el-table-column prop="projectName" label="项目名称" min-width="180" align="center" />
        <el-table-column prop="userNickname" label="质检员姓名" min-width="180" align="center" />
        <el-table-column prop="taskName" label="任务名称" min-width="180" align="center" />
        <el-table-column prop="homeworkCount" label="原始作业数量" min-width="180" align="center" />
        <el-table-column prop="homeworkValidCount" label="有效作业数量" min-width="180" align="center" />
        <el-table-column v-if="activeName ==='secondInspection'" prop="validCount" label="一检有效总框数" min-width="180" align="center" />
        <el-table-column v-if="activeName !=='secondInspection'" prop="validCount" label="标注总框数" min-width="180" align="center" />
        <el-table-column prop="deleteCount" label="删除框数" min-width="180" align="center" />
        <el-table-column prop="insertCount" label="增加框数" min-width="180" align="center" />
        <el-table-column prop="updateCount" label="调整框数" min-width="180" align="center" />
        <el-table-column prop="checkValidCount" :label="activeName ==='firsInspection' ? '一检有效框数':'二检有效框数'" min-width="180" align="center" />
        <el-table-column label="操作" min-width="180" align="center">
          <template slot-scope="scope">
            <el-button v-if="activeName !== 'teamListData'" type="text" @click="jobDetail(scope.row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination-component
        :total="total"
        :page-index.sync="page"
        :page-size.sync="limit"
        @pagination="changePage"
      />
    </template>
  </PageContainer>
</template>

<script>
import PageContainer from '@/components/PageContainer'
import PaginationComponent from '@/components/PaginationComponent'
import SearchCondition from '@/components/SearchConditionBox'
import tableMixin from '@/utils/tableMixin'
import { mapGetters, mapMutations } from 'vuex'
import {
  searchTeamLeaderDataList,
  searchTeamLeaderStatisticsDataList, teamLeaderStatisticsQc
} from '@/api/dataStatistics'
import {downloadExcelData} from '@/utils/total'

export default {
  name: 'TeamLeaderStatistics',
  components: {
    PageContainer,
    PaginationComponent,
    SearchCondition
  },
  mixins: [tableMixin],
  data() {
    return {
      teamListOptions: [], // 团队名称列表
      teamNameId: '', // 选中的团队id
      searchCondition: {}, // 查询条件
      activeName: 'teamListData',
      page: 1, // 页数
      limit: 20, // 条数
      total: 0, // 总数
      tableData: [], // 表格数据
      showPageData: false,
      tableLoading: false // 表格数据加载
    }
  },
  computed: {
    ...mapGetters('teamLeaderStatistics', [
      'getSearchCondition',
      'getTeamNameId',
      'getPage',
      'getActiveName',
      'getLimit'
    ])
  },
  // watch: {
  //   searchCondition: {
  //     handler(val) {
  //       this.searchCondition = val
  //     },
  //     deep: true // 当为 true 时，会监听对象内部属性的变化
  //   }
  // },
  mounted() {
    this.getTeamList()
    if (this.getTeamNameId) {
      // 如果选中过团队id，获取vuex里的缓存数据
      this.teamNameId = this.getTeamNameId
      this.activeName = this.getActiveName
      this.showPageData = true
      this.getTableMaxHeight(true)
      // 当前页的查询数据
      this.searchCondition = {...this.getSearchCondition}
      // 修改查询组件里的查询数据
      this.$refs.childRef._data.searchCondition = { ...this.getSearchCondition }
      this.$refs.childRef._data.dateTime = [this.getSearchCondition.startTime, this.getSearchCondition.endTime]
      this.getDataList()
    } else {
      // 初次进入页面获取查询组件里的初始数据
      this.searchCondition = this.$refs.childRef._data.searchCondition
      this.searchCondition.startTime = this.$refs.childRef._data.dateTime[0]
      this.searchCondition.endTime = this.$refs.childRef._data.dateTime[1]
    }
  },
  methods: {
    ...mapMutations('teamLeaderStatistics', ['resetState', 'RESET_SEARCH_CONDITION', 'RESET_TEAM_NAME_ID', 'RESET_PAGE', 'RESET_LIMIT', 'RESET_ACTIVE_NAME']),
    downloadExcelData,
    // 切换tab页面
    handleClick() {
      // this.searchCondition = {}
      this['RESET_ACTIVE_NAME'](this.activeName)
      this.page = 1
      this.getDataList()
    },
    // 获取团队名称数据
    getTeamList() {
      searchTeamLeaderDataList().then(res => {
        this.teamListOptions = res.data
      })
    },
    // 选中团队获取列表
    getTeam() {
      this['RESET_TEAM_NAME_ID'](this.teamNameId)
      this.showPageData = true
      this.getTableMaxHeight(true)
      this.searchData()
    },
    searchData() {
      this.page = 1
      this['RESET_SEARCH_CONDITION'](this.searchCondition)
      this.getDataList()
    },
    getDataList() {
      this.tableLoading = true
      this.searchCondition.pageIndex = this.page
      this.searchCondition.pageSize = this.limit
      this.searchCondition.teamId = this.teamNameId
      if (this.activeName === 'teamListData') {
        searchTeamLeaderStatisticsDataList(this.searchCondition).then(res => {
          this.tableData = res.data.records
          this.total = Number(res.data.total)
          this.tableLoading = false
        }).catch(() => {
          this.tableLoading = false
        })
      } else {
        this.searchCondition.type = 1
        this.searchCondition.checkType = this.activeName === 'firsInspection' ? 0 : 1
        teamLeaderStatisticsQc(this.searchCondition).then(res => {
          this.tableData = res.data.records
          this.total = Number(res.data.total)
          this.tableLoading = false
        }).catch(() => {
          this.tableLoading = false
        })
      }
    },
    // 导出表格
    async excelData() {
      let excelTableData = []
      let fileName = ''
      if (this.activeName === 'teamListData') {
        excelTableData = [['序号', '项目名称', '标注员姓名', '任务数量', '标注总框数', '一检驳回次数']]
        fileName = 'teamLeader数据统计.xlsx'
      } else if (this.activeName === 'firsInspection') {
        excelTableData = [['序号', '项目名称', '质检员姓名', '任务名称', '原始作业数量', '有效作业数量', '标注总框数', '删除框数', '增加框数', '调整框数', '一检有效框数']]
        fileName = '一检数据统计.xlsx'
      } else if (this.activeName === 'secondInspection') {
        excelTableData = [['序号', '项目名称', '质检员姓名', '任务名称', '原始作业数量', '有效作业数量', '一检有效总框数', '删除框数', '增加框数', '调整框数', '二检有效框数']]
        fileName = '二检数据统计.xlsx'
      }

      if (this.activeName === 'teamListData') {
        const result = await searchTeamLeaderStatisticsDataList({ ...this.searchCondition, pageSize: this.total })
        result.data.records.forEach((item, index) => {
          item.index = index + 1
          excelTableData.push([
            item.index,
            item.projectName,
            item.userNickname,
            item.taskCount,
            item.boxCount,
            item.checkRejectCount
          ])
        })
      } else {
        const result = await teamLeaderStatisticsQc({ ...this.searchCondition, pageSize: this.total })
        result.data.records.forEach((item, index) => {
          item.index = index + 1
          excelTableData.push([
            item.index,
            item.projectName,
            item.userNickname,
            item.taskName,
            item.homeworkCount,
            item.homeworkValidCount,
            item.validCount,
            item.deleteCount,
            item.insertCount,
            item.updateCount,
            item.checkValidCount
          ])
        })
      }
      this.downloadExcelData(excelTableData, fileName)
    },
    // 详情
    details(row) {
      this.$router.push({name: 'TeamLeaderStatisticsDetails', params: {'projectName': row.projectName, 'userNickname': row.userNickname, 'userId': row.userId, 'projectId': row.projectId}})
    },
    jobDetail(row) {
      this.$router.push({name: 'TeamLeaderStatisticsJobDetailQc', params: {'projectId': row.projectId, 'taskId': row.taskId}})
    },
    // 换页
    changePage(value) {
      this.page = value.page
      this.limit = value.limit
      this.getDataList()
    }
  }
}
</script>

<style scoped>
</style>
