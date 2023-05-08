<!--
* @FileDescription: 我的任务-作业详情
* @Author: guo hongwei
* @Date: 2023-04-07
-->
<template>
  <PageContainer has-search>
    <div slot="search">
      <!--      表单显示待调整-->
      <el-form inline>
        <el-row>
          <el-col :span="6">
            <el-form-item label="项目名称">
              {{ projectData.projectName }}
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="任务ID">
              {{ info.id }}
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="任务名称">
              {{ projectData.name }}
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
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
        <el-table-column prop="id" label="作业ID" min-width="180" align="center" />
        <el-table-column prop="name" label="作业名称" min-width="180" align="center" />
        <el-table-column prop="" label="标注" min-width="180" align="center">
          <el-table-column prop="" label="标注已用时" min-width="180" align="center" />
          <el-table-column prop="status" label="状态" min-width="180" align="center">
            <template slot-scope="scope">
              <el-tag :type="scope.row.status !== 3? '' : 'success'">{{ handleStatus(scope.row.status) }}</el-tag>
            </template>
          </el-table-column>
        </el-table-column>
        <!--        操作功能未完成-->
        <el-table-column label="操作" min-width="180" align="center">
          <template>
            <el-button type="text" size="small">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <PaginationComponent v-if="total" :page-index="queryCondition.pageIndex" :page-size="queryCondition.pageSize" :total="total" @pagination="handlePage" />
    </div>
  </PageContainer>
</template>

<script>
import PageContainer from '@/components/PageContainer'
import PaginationComponent from '@/components/PaginationComponent'
import {getJobDetailInfo, getOperationDataList} from '@/api/task'
import tableMixin from '@/utils/tableMixin'
export default {
  name: 'JobDetail',
  components: {
    PageContainer,
    PaginationComponent
  },
  mixins: [tableMixin],
  data() {
    return {
      // 查询条件
      queryCondition: {
        pageIndex: 1,
        pageSize: 20,
        taskId: ''
      },
      info: {},
      projectData: {}, // 接收项目数据
      tableData: [],
      total: 0,
      tableLoading: false
    }
  },
  mounted() {
    this.initPageData()
    this.info.id = this.$route.params.taskId
    this.queryCondition.taskId = this.$route.params.taskId
    this.queryCondition.pageIndex = 1
    this.queryCondition.pageSize = 20
    this.handlePage()
    this.jobDetail()
  },
  methods: {
    initPageData() {
      this.getTableMaxHeight()
    },
    // 处理状态
    handleStatus(value) {
      if (value === 0) {
        return '未质检'
      } else if (value === 1) {
        return '质检中'
      } else if (value === 2) {
        return '已挂起'
      } else {
        return '已完成'
      }
    },
    // 分页信息
    handlePage() {
      this.tableLoading = true
      getOperationDataList(this.queryCondition).then(res => {
        this.tableData = res.data.records
        this.total = res.data.total
        this.tableLoading = false
      }).catch(() => {
        this.tableData = []
        this.total = 0
        this.tableLoading = false
      })
    },
    jobDetail() {
      getJobDetailInfo(this.info.id).then(res => {
        this.projectData = {...res.data}
      })
    }
  }
}
</script>

<style scoped>

</style>
