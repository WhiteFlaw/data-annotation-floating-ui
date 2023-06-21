<!--
* @FileDescription: teamLeader 数据列表详情
* @Author: Wu Zixuan
* @Date: 2023-06-16
-->
<template>
  <PageContainer has-search>
    <div slot="content">
      <el-form inline>
        <el-row>
          <el-col :span="12">
            <el-form-item label="项目名称：">{{ projectName }}</el-form-item>
            <el-form-item label="标注员名称：">{{ userNickname }}</el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-table
        v-loading="tableLoading"
        :data="tableData"
        style="width: 100%"
        :max-height="tableMaxHeight"
        border
        stripe
        highlight-current-row
      >
        <el-table-column label="序号" width="100" align="center" type="index" />
        <el-table-column prop="name" label="任务名称" min-width="180" align="center" />
        <el-table-column prop="totalCount" label="作业数量" min-width="180" align="center" />
        <el-table-column prop="boxCount" label="标注总框数" min-width="180" align="center" />
      </el-table>
      <pagination-component
        :total="total"
        :page-index.sync="page"
        :page-size.sync="limit"
        @pagination="changePage"
      />
    </div>
  </PageContainer>
</template>

<script>
import PageContainer from '@/components/PageContainer'
import PaginationComponent from '@/components/PaginationComponent'
import tableMixin from '@/utils/tableMixin'
import {searchTeamLeaderStatisticsTeamTaggerInfo} from '@/api/dataStatistics'

export default {
  name: 'TeamLeaderStatisticsDetails',
  components: {
    PageContainer,
    PaginationComponent
  },
  mixins: [tableMixin],
  data() {
    return {
      // 查询条件
      queryCondition: {
        userId: 0,
        projectId: ''
      },
      tableData: [],
      page: 1, // 页数
      limit: 20, // 条数
      total: 0, // 总数
      projectName: '',
      userNickname: '',
      tableLoading: false
    }
  },
  mounted() {
    this.projectName = this.$route.params.projectName
    this.userNickname = this.$route.params.userNickname
    this.queryCondition.userId = this.$route.params.userId
    this.queryCondition.projectId = this.$route.params.projectId
    this.getDataList()
  },
  methods: {
    getDataList() {
      this.getTableMaxHeight()
      this.tableLoading = true
      this.queryCondition.pageIndex = this.page
      this.queryCondition.pageSize = this.limit
      searchTeamLeaderStatisticsTeamTaggerInfo(this.queryCondition).then(res => {
        this.tableData = res.data.records
        this.total = Number(res.data.total)
        this.tableLoading = false
      }).catch(() => {
        this.tableLoading = false
      })
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
