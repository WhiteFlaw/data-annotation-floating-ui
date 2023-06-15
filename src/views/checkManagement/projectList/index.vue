<!--
* @FileDescription: 验收-项目列表
* @Author: yang pengfei
* @Date: 2023-04-19
-->
<template>
  <page-container has-search>
    <template slot="search">
      <el-form inline>
        <el-row>
          <el-col>
            <el-form-item label="项目名称">
              <el-input v-model="searchCondition.name" clearable />
            </el-form-item>
            <el-form-item label="项目类型">
              <el-select v-model="searchCondition.type">
                <el-option :value="0" label="全部" />
                <el-option :value="1" label="2D" />
                <el-option :value="2" label="3D" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="search">筛选</el-button>
              <el-button plain @click="resetSearchCondition">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
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
        <el-table-column prop="id" align="center" label="项目ID" width="120" />
        <el-table-column prop="name" align="center" label="项目名称" min-width="150" />
        <el-table-column prop="" align="center" label="验收进度" width="150">
          <template slot-scope="scope">
            {{ scope.row.atBatchPassCount + '/' + scope.row.atBatchCount }}
          </template>
        </el-table-column>
        <el-table-column prop="managerNickname" align="center" label="项目经理" width="100" />
        <el-table-column prop="createdTime" align="center" label="创建时间" width="160">
          <template slot-scope="scope">
            {{ scope.row.createdTime.indexOf('T') !== -1 ? (scope.row.createdTime.split('T')[0] + ' ' + scope.row.createdTime.split('T')[1]) : scope.row.createdTime }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" fixed="right" width="250">
          <template slot-scope="scope">
            <el-button type="text" @click="openProjectDetails(scope.row)">详情</el-button>
            <el-button type="text" @click="acceptanceProject(scope.row)">验收</el-button>
            <el-button type="text" @click="acceptProject(scope.row)">验收通过</el-button>
            <el-button type="text" @click="rejectProject(scope.row)">验收驳回</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination-component
        v-if="total > 0"
        :total="total"
        :page-index.sync="page"
        :page-size.sync="limit"
        @pagination="changePage"
      />
      <template v-if="acceptanceVisible">
        <acceptance-percentage
          :visible.sync="acceptanceVisible"
          :project-details="projectDetails"
        />
      </template>
    </template>
  </page-container>
</template>

<script>
import PageContainer from '@/components/PageContainer'
import tableMixin from '@/utils/tableMixin'
import PaginationComponent from '@/components/PaginationComponent'
import {acceptanceVerification, checkProject, queryItemDataList} from '@/api/check'
import AcceptancePercentage from '@/views/checkManagement/components/AcceptancePercentage'
export default {
  name: 'ItemList',
  components: {AcceptancePercentage, PaginationComponent, PageContainer},
  mixins: [tableMixin],
  data() {
    return {
      tableData: [],
      tableLoading: false,
      searchCondition: {
        distinction: 1, // 区分标注还是质检(0标注/1质检)
        name: '', // 项目名称
        pageIndex: 1, // 查询页码
        pageSize: 20, // 每页条数
        status: 2, // 状态
        type: 0 // 项目类型
      },
      total: 0,
      page: 1,
      limit: 20,
      acceptanceVisible: false,
      projectDetails: {}
    }
  },
  mounted() {
    this.initPageData()
    this.search()
  },
  methods: {
    // 页面初始化
    initPageData() {
      this.getTableMaxHeight()
    },
    format(val1, val2) {
      return () => {
        return (val1 || 0) + '/' + (val2 || 0) + '(' + (Number(val2) !== 0 ? (Number((((val1 || 0) / val2) * 100).toFixed(2))) : 0) + '%)'
      }
    },
    openProjectDetails(row) { // 打开详情
      this.$router.push({
        path: '/checkManagement/projectDetail',
        query: {
          projectId: row.id // 点击详情进入详情页面，根据项目id查询任务列表
        }
      })
    },
    changePage(val) { // 分页
      this.page = val.page
      this.limit = val.limit
      this.searchData()
    },
    search() { // 查询按钮
      this.page = 1
      this.limit = 20
      this.searchData()
    },
    searchData() { // 查询数据
      this.searchCondition.pageIndex = this.page
      this.searchCondition.pageSize = this.limit
      this.tableLoading = true
      queryItemDataList(this.searchCondition).then(res => {
        this.tableData = res.data.records
        this.total = res.data.total
        this.tableLoading = false
      }).catch(() => {
        this.tableLoading = false
      })
    },
    resetSearchCondition() { // 重置查询条件
      this.searchCondition = {
        distinction: 1, // 区分标注还是质检(0标注/1质检)
        name: '', // 项目名称
        pageIndex: 1, // 查询页码
        pageSize: 20, // 每页条数
        status: 2, // 状态
        type: 0 // 项目类型
      }
      this.page = 1
      this.limit = 20
      this.searchData()
    },
    acceptProject(info) {
      let msg = ''
      acceptanceVerification(info.id).then(res => {
        if (res.msg === 'T') {
          msg = '确认一键验收此项目吗？'
        } else if (res.msg === 'F') {
          msg = '当前项目有未通过任务，是否一键验收此项目？'
        } else if (res.msg === 'N') {
          msg = '当前项目未验收，是否一键验收此项目？'
        } else if (res.msg === 'C') {
          msg = '当前项目还有任务未验收，是否一键验收此项目？'
        }
        this.$confirm(msg, '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          checkProject({
            projectId: info.id,
            type: 0
          }).then(res => {
            if (res.success) {
              this.$message.success(res.msg)
              this.search()
            }
          })
        }).catch(() => {
          this.$message.info('验收已取消')
        })
      })
    },
    rejectProject(info) {
      this.$confirm(`确认一键驳回本项目吗？`, '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        checkProject({
          projectId: info.id,
          type: 1
        }).then(res => {
          if (res.success) {
            this.$message.success(res.msg)
            this.search()
          }
        })
      }).catch(() => {
        this.$message.info('驳回已取消')
      })
    },
    acceptanceProject(val) { // 验收
      if (Number(val.atBatchCount) !== 0) { // 如果有验收进度即有正在验收的批次
        this.$router.push({
          name: 'projectDetail',
          query: {
            projectId: val.id, // 点击详情进入详情页面，根据项目id查询任务列表
            percent: 10
          }
        })
      } else if (Number(val.atBatchCount) === 0) {
        this.acceptanceVisible = true
        this.projectDetails = val
      }
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep {
  .el-progress-class{
    display: flex;
    justify-content: space-between;
    .el-progress{
      width: 300px;
      display: flex;
      align-items: center;
      .el-progress-bar{
        width: 200px;
      }
    }
  }
}
</style>
