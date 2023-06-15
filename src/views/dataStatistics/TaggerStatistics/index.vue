<!--
* @FileDescription: 标注统计
* @Author: Yang Pengfei
* @Date: 2023-06-12
-->
<template>
  <PageContainer has-search>
    <template slot="search">
      <search-condition is-has-date is-has-project-name is-has-task-name @search-data="searchData" @excel-data="excelData" />
    </template>
    <div slot="content">
      <!--      表格字段待调整-->
      <el-table
        v-loading="tableLoading"
        :data="tableData"
        style="width: 100%"
        :max-height="tableMaxHeight"
        border
        stripe
        highlight-current-row
      >
        <el-table-column label="序号" width="80" align="center" type="index" />
        <el-table-column prop="taskName" label="任务名称" min-width="180" align="center" />
        <el-table-column prop="homeworkCount" label="作业数量" min-width="180" align="center" />
        <el-table-column prop="boxCount" label="标注总框数" min-width="180" align="center" />
        <el-table-column prop="diffDate" label="任务时长" min-width="250" align="center" />
      </el-table>
      <PaginationComponent v-if="total" :page-index="page" :page-size="limit" :total="total" @pagination="changePage" />
    </div>
  </PageContainer>
</template>

<script>
import PageContainer from '@/components/PageContainer'
import PaginationComponent from '@/components/PaginationComponent'
import tableMixin from '@/utils/tableMixin'
import SearchCondition from '@/components/SearchConditionBox'
import {searchTaggerStatisticsDataList} from '@/api/dataStatistics'
import {downloadExcelData, getDateDiff} from '@/utils/total'

export default {
  name: 'TaggerStatistics',
  components: {
    PageContainer,
    PaginationComponent,
    SearchCondition
  },
  mixins: [tableMixin],
  data() {
    return {
      searchCondition: {}, // 查询条件
      page: 1, // 页数
      limit: 20, // 条数
      // 查询条件
      tableData: [],
      total: 0,
      tableLoading: false
    }
  },
  mounted() {
    this.initPageData()
  },
  methods: {
    downloadExcelData,
    initPageData() {
      this.getTableMaxHeight()
      this.searchData()
    },
    // 查询数据
    searchData(searchCondition) {
      this.searchCondition = { ...searchCondition }
      this.getDataList()
    },
    // 分页信息
    changePage(value) {
      this.page = value.page
      this.limit = value.limit
      this.getDataList()
    },
    getDataList() {
      this.tableLoading = true
      this.searchCondition.pageIndex = this.page
      this.searchCondition.pageSize = this.limit
      searchTaggerStatisticsDataList(this.searchCondition).then(res => {
        this.tableData = res.data.records
        this.tableData.forEach(item => {
          item.diffDate = getDateDiff(item.startTime, item.endTime)
        })
        this.total = Number(res.data.total)
        this.tableLoading = false
      }).catch(() => {
        this.tableLoading = false
      })
    },
    // 导出数据
    async excelData() {
      const excelTableData = [['序号', '任务名称', '作业数量', '标注总框数', '任务时长']]
      const result = await searchTaggerStatisticsDataList({ ...this.searchCondition, pageSize: this.total })
      result.data.records.forEach((item, index) => {
        item.index = index + 1
        item.diffDate = getDateDiff(item.startTime, item.endTime)
        excelTableData.push([
          item.index,
          item.taskName,
          item.homeworkCount,
          item.boxCount,
          item.diffDate
        ])
      })
      this.downloadExcelData(excelTableData, '标注员数据统计.xlsx')
    }
  }
}
</script>

<style scoped lang="scss">
</style>
