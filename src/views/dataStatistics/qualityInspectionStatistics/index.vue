<!--
* @FileDescription: 质检员数据统计
* @Author: Yu Yang
* @Date: 2023-06-13
-->
<template>
  <page-container has-search>
    <template slot="search">
      <search-condition is-has-date is-has-user-nickname is-has-task-name is-has-work-name @search-data="searchData" @excel-data="excelData" />
    </template>
    <template slot="content">
      <el-tabs v-model="activeName" type="card" @tab-click="changeTab">
        <el-tab-pane label="一检" name="2" />
        <el-tab-pane label="二检" name="3" />
      </el-tabs>
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
        <el-table-column prop="userNickname" label="标注员姓名" align="center" min-width="150" />
        <el-table-column prop="taskName" label="任务名称" align="center" min-width="100" />
        <el-table-column prop="homeworkCount" label="原始作业数量" align="center" min-width="120" />
        <el-table-column prop="homeworkValidCount" label="有效作业数量" align="center" min-width="120" />
        <el-table-column v-if="activeName === '2'" prop="validCount" label="标注总框数" align="center" min-width="120" />
        <el-table-column v-if="activeName === '3'" prop="checkValidCount" label="一检有效总框数" align="center" min-width="120" />
        <el-table-column prop="deleteCount" label="删减框数" align="center" min-width="120" />
        <el-table-column prop="insertCount" label="增加框数" align="center" min-width="120" />
        <el-table-column prop="updateCount" label="调整框数" align="center" min-width="120" />
        <el-table-column v-if="activeName === '2'" prop="validCount" label="一检有效框数" align="center" min-width="120" />
        <el-table-column v-if="activeName === '3'" prop="checkValidCount" label="二检有效框数" align="center" min-width="120" />
        <el-table-column label="操作" align="center" min-width="120">
          <template slot-scope="scope">
            <el-button type="text" @click="viewDetail(scope.row)"> 详情 </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination-component
        :total="tableTotal"
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
import { searchQualityInspectionStatisticsDataList } from '@/api/dataStatistics'
import { downloadExcelData, getLocalDate } from '@/utils/total'
export default {
  name: 'QualityInspectionStatictics',
  components: { SearchCondition, PageContainer, PaginationComponent },
  mixins: [tableMixin],
  data() {
    return {
      searchCondition: {}, // 查询条件
      activeName: '2', // tab标签
      tableData: [], // 表格数据
      tableLoading: false, // 表格数据加载
      pageFirst: 1, // 一检页数
      limitFirst: 20, // 一检条数
      totalFirst: 0, // 一检总数
      pageSecond: 1, // 二检页数
      limitSecond: 20, // 二检条数
      totalSecond: 0 // 二检总数
    }
  },
  computed: {
    page() {
      return this.activeName === '2' ? this.pageFirst : this.pageSecond
    },
    limit() {
      return this.activeName === '2' ? this.limitFirst : this.limitSecond
    },
    tableTotal() {
      return this.activeName === '2' ? this.totalFirst : this.totalSecond
    }
  },
  mounted() {
    this.initPageData()
  },
  methods: {
    getLocalDate,
    downloadExcelData,
    // 页面初始化
    initPageData() {
      this.getTableMaxHeight(true)
      this.searchData()
    },
    // 查询数据
    searchData(searchCondition) {
      this.searchCondition = { ...searchCondition }
      this.getDataList()
    },
    // 分页
    changePage(value) {
      if (this.activeName === '2') {
        this.pageFirst = value.page
        this.limitFirst = value.limit
      } else {
        this.pageSecond = value.page
        this.limitSecond = value.limit
      }
      this.getDataList()
    },
    // 切换tab标签
    changeTab() {
      this.getDataList()
    },
    getDataList() {
      this.searchCondition.pageIndex = this.activeName === '2' ? this.pageFirst : this.pageSecond
      this.searchCondition.pageSize = this.activeName === '2' ? this.limitFirst : this.limitSecond
      this.searchCondition.checkType = this.activeName === '2' ? 0 : 1
      this.searchCondition.type = 0
      this.searchCondition.startTime = 'startTime' in this.searchCondition ? this.searchCondition.startTime : this.getLocalDate()
      this.searchCondition.endTime = 'endTime' in this.searchCondition ? this.searchCondition.endTime : this.getLocalDate()
      searchQualityInspectionStatisticsDataList(this.searchCondition).then(res => {
        this.tableData = res.data.records
        if (this.activeName === '2') {
          this.totalFirst = Number(res.data.total)
        } else {
          this.totalSecond = Number(res.data.total)
        }
        this.tableLoading = false
      }).catch(() => {
        this.tableLoading = false
      })
    },
    // 导出数据
    async excelData() {
      let excelTableData = []
      excelTableData = this.activeName === '2' ? [['序号', '项目名称', '标注员姓名', '任务名称', '原始作业数量', '有效作业数量', '标注总框数', '删减框数', '增加框数', '调整框数', '一检有效框数']] : [['序号', '项目名称', '标注员姓名', '任务名称', '原始作业数量', '有效作业数量', '一检有效总框数', '删减框数', '增加框数', '调整框数', '二检有效框数']]
      const result = await searchQualityInspectionStatisticsDataList({ ...this.searchCondition, pageSize: this.tableTotal })
      if (this.activeName === '2') {
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
            item.validCount
          ])
        })
      } else {
        result.data.records.forEach((item, index) => {
          item.index = index + 1
          excelTableData.push([
            item.index,
            item.projectName,
            item.userNickname,
            item.taskName,
            item.homeworkCount,
            item.homeworkValidCount,
            item.checkValidCount,
            item.deleteCount,
            item.insertCount,
            item.updateCount,
            item.checkValidCount
          ])
        })
      }
      this.downloadExcelData(excelTableData, '质检员数据统计.xlsx')
    },
    // 详情
    viewDetail(row) {
      this.$router.push({ name: 'JobDetailQc', params: { projectId: row.projectId, taskId: row.taskId } })
    }
  }
}
</script>

<style  scoped lang="scss">

</style>
