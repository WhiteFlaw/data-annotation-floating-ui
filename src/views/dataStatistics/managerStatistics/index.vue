<!--
* @FileDescription: 项目经理数据统计
* @Author: Yu Yang
* @Date: 2023-06-12
-->
<template>
  <page-container has-search>
    <template slot="search">
      <search-condition is-has-date is-has-project-name is-has-team-name @search-data="searchData" @excel-data="excelData" />
    </template>
    <template slot="content">
      <el-table
        v-loading="tableLoading"
        :data="tableData"
        border
        stripe
        highlight-current-row
        :max-height="tableMaxHeight"
      >
        <el-table-column type="index" label="序号" align="center" width="60" />
        <el-table-column prop="projectName" label="项目名称" align="center" min-width="150" />
        <el-table-column prop="teamName" label="团队名称" align="center" min-width="150" />
        <el-table-column prop="taskCount" label="任务数量" align="center" min-width="100" />
        <el-table-column prop="recheckBoxCount" label="二检合格总框数" align="center" min-width="120" />
        <el-table-column prop="rejectCount" label="验收驳回次数" align="center" min-width="120" />
      </el-table>
      <pagination-component
        :total="total"
        :page-index.sync="page"
        :page-size.sync="limit"
        @pagination="changePage"
      />
    </template>
  </page-container>
</template>

<script>
import PageContainer from '@/components/PageContainer'
import SearchCondition from '@/components/SearchConditionBox'
import PaginationComponent from '@/components/PaginationComponent'
import tableMixin from '@/utils/tableMixin'
import { searchManagerStatisticsDataList } from '@/api/dataStatistics'
import { downloadExcelData } from '@/utils/total'
export default {
  name: 'ManagerStatistics',
  components: { SearchCondition, PageContainer, PaginationComponent },
  mixins: [tableMixin],
  data() {
    return {
      searchCondition: {}, // 查询条件
      page: 1, // 页数
      limit: 20, // 条数
      total: 0, // 总数
      tableData: [], // 表格数据
      tableLoading: false // 表格数据加载
    }
  },
  mounted() {
    this.initPageData()
  },
  methods: {
    downloadExcelData,
    // 页面初始化
    initPageData() {
      this.getTableMaxHeight()
      this.searchData()
    },
    // 查询数据
    searchData(searchCondition) {
      this.searchCondition = { ...searchCondition }
      this.getDataList()
    },
    // 分页
    changePage(value) {
      this.page = value.page
      this.limit = value.limit
      this.getDataList()
    },
    getDataList() {
      this.tableLoading = true
      this.searchCondition.pageIndex = this.page
      this.searchCondition.pageSize = this.limit
      this.searchCondition.startTime = 'startTime' in this.searchCondition ? this.searchCondition.startTime : this.getLocalDate()
      this.searchCondition.endTime = 'endTime' in this.searchCondition ? this.searchCondition.endTime : this.getLocalDate()
      searchManagerStatisticsDataList(this.searchCondition).then(res => {
        this.tableData = res.data.records
        this.total = Number(res.data.total)
        this.tableLoading = false
      }).catch(() => {
        this.tableLoading = false
      })
    },
    // 导出数据
    async excelData() {
      const excelTableData = [['序号', '项目名称', '团队名称', '任务数量', '二检合格总框数', '验收驳回次数']]
      const result = await searchManagerStatisticsDataList({ ...this.searchCondition, pageSize: this.total })
      result.data.records.forEach((item, index) => {
        item.index = index + 1
        excelTableData.push([
          item.index,
          item.projectName,
          item.teamName,
          item.taskCount,
          item.recheckBoxCount,
          item.rejectCount
        ])
      })
      this.downloadExcelData(excelTableData, '项目经理数据统计.xlsx')
    }
  }
}
</script>

<style scoped>

</style>
