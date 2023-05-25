<!--
* @FileDescription: 一轮质检 - 项目列表
* @Author: Gu Xunqin
* @Date: 2023-04-17
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
            <el-form-item label="项目状态">
              <el-select v-model="searchCondition.status">
                <el-option :value="0" label="全部" />
                <el-option :value="1" label="进行中" />
                <el-option :value="2" label="验收中" />
                <el-option :value="3" label="已完成" />
              </el-select>
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
      <div class="has-chart-container">
        <div class="table-container">
          <el-table v-loading="tableLoading" :data="tableData" border stripe highlight-current-row :max-height="tableMaxHeight">
            <el-table-column prop="id" align="center" label="项目ID" width="120" />
            <el-table-column prop="name" align="center" label="项目名称" min-width="150" />
            <el-table-column prop="managerNickname" align="center" label="项目经理" width="100" />
            <el-table-column prop="status" align="center" label="项目状态" width="100">
              <template slot-scope="scope">
                <el-tag :type="scope.row.status === 3 ? 'success' : ''">{{ changeProjectStatus(scope.row.status) }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column align="center" label="总进度" min-width="300">
              <template slot-scope="scope">
                <span class="el-progress-class progress-container">
                  <span class="progress-label">待领取：</span>
                  <el-progress
                    :percentage="scope.row.taskCount !== 0 ? Number((((scope.row.toBeClaimedCount || 0) / scope.row.taskCount) * 100).toFixed(2)) : 0"
                    :format="format(scope.row.toBeClaimedCount, scope.row.taskCount)" />
                </span>
                <span class="el-progress-class progress-container">
                  <span class="progress-label">标注中：</span>
                  <el-progress
                    :percentage="scope.row.taskCount !== 0 ? Number((((scope.row.allAnnotatedCount || 0) / scope.row.taskCount) * 100).toFixed(2)) : 0"
                    :format="format(scope.row.allAnnotatedCount, scope.row.taskCount)" />
                </span>
                <span class="el-progress-class progress-container">
                  <span class="progress-label">一检：</span>
                  <el-progress
                    :percentage="scope.row.taskCount !== 0 ? Number((((scope.row.firstInspectionCount || 0) / scope.row.taskCount) * 100).toFixed(2)) : 0"
                    :format="format(scope.row.firstInspectionCount, scope.row.taskCount)" />
                </span>
                <span class="el-progress-class progress-container">
                  <span class="progress-label">二检：</span>
                  <el-progress
                    :percentage="scope.row.taskCount !== 0 ? Number((((scope.row.secondInspectionCount || 0) / scope.row.taskCount) * 100).toFixed(2)) : 0"
                    :format="format(scope.row.secondInspectionCount, scope.row.taskCount)" />
                </span>
                <span class="el-progress-class progress-container">
                  <span class="progress-label">待验收：</span>
                  <el-progress
                    :percentage="scope.row.taskCount !== 0 ? Number((((scope.row.atCount || 0) / scope.row.taskCount) * 100).toFixed(2)) : 0"
                    :format="format(scope.row.atCount, scope.row.taskCount)" />
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="createdTime" align="center" label="创建时间" width="160">
              <template slot-scope="scope">
                {{
                  scope.row.createdTime.indexOf('T') !== -1
                    ? scope.row.createdTime.split('T')[0] + ' ' + scope.row.createdTime.split('T')[1]
                    : scope.row.createdTime
                }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作" min-width="60">
              <template slot-scope="scope">
                <el-button type="text" @click="openProjectDetails(scope.row)">详情</el-button>
              </template>
            </el-table-column>
          </el-table>
          <pagination-component v-if="total > 0" :total="total" :page-index.sync="page" :page-size.sync="limit" @pagination="changePage" />
        </div>
        <div class="chart-container">
          <h2>一检工作量统计（当日）</h2>
          <bar-chart :width="480" :height="360" :chart-data-sets="chartDataSets" />
        </div>
      </div>
    </template>
  </page-container>
</template>

<script>
import PageContainer from '@/components/PageContainer'
import tableMixin from '@/utils/tableMixin'
import PaginationComponent from '@/components/PaginationComponent'
import { queryItemDataList } from '@/api/roundOfInspection'
import BarChart from '@/components/Charts/BarChart'
import { getJobStatusChartData } from '@/api/common'
export default {
  name: 'ItemList',
  components: { PaginationComponent, PageContainer, BarChart },
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
        status: 0, // 状态
        type: 0 // 项目类型
      },
      total: 0,
      page: 1,
      limit: 20,
      chartDataSets: null
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
      getJobStatusChartData({ type: 1 }).then((res) => {
        if (res.success) {
          this.chartDataSets = [...res.data]
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    format(val1, val2) {
      return () => {
        return (val1 || 0) + '/' + (val2 || 0) + '(' + (Number(val2) !== 0 ? Number((((val1 || 0) / val2) * 100).toFixed(2)) : 0) + '%)'
      }
    },
    openProjectDetails(row) {
      // 打开详情
      this.$router.push({
        path: '/myTask/roundOfInspection/projectDetails',
        query: {
          projectId: row.id // 点击详情进入详情页面，根据项目id查询任务列表
        }
      })
    },
    changePage(val) {
      // 分页
      this.page = val.page
      this.limit = val.limit
      this.searchData()
    },
    search() {
      // 查询按钮
      this.page = 1
      this.limit = 20
      this.searchData()
    },
    searchData() {
      // 查询数据
      this.searchCondition.pageIndex = this.page
      this.searchCondition.pageSize = this.limit
      this.tableLoading = true
      queryItemDataList(this.searchCondition)
        .then((res) => {
          this.tableData = res.data.records
          this.total = res.data.total
          this.tableLoading = false
        })
        .catch(() => {
          this.tableLoading = false
        })
    },
    resetSearchCondition() {
      // 重置查询条件
      this.searchCondition = {
        distinction: 1, // 区分标注还是质检(0标注/1质检)
        name: '', // 项目名称
        pageIndex: 1, // 查询页码
        pageSize: 20, // 每页条数
        status: 0, // 状态
        type: 0 // 项目类型
      }
      this.page = 1
      this.limit = 20
      this.searchData()
    },
    changeProjectStatus(val) {
      let status
      switch (val) {
        case 0:
          status = '全部'
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
    }
  }
}
</script>

<style scoped lang="scss"></style>
