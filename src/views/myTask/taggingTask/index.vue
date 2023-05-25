<!--
* @FileDescription: 我的任务-项目列表
* @Author: guo hongwei
* @Date: 2023-04-07
-->
<template>
  <PageContainer has-search>
    <div slot="search">
      <el-form inline>
        <el-form-item label="项目名称：">
          <el-input v-model="queryCondition.name" placeholder="输入任务名称进行搜索" />
        </el-form-item>
        <el-form-item label="项目状态：">
          <el-select v-model="queryCondition.status">
            <el-option :value="0" label="全部" />
            <el-option :value="1" label="进行中" />
            <el-option :value="2" label="验收中" />
            <el-option :value="3" label="已完成" />
          </el-select>
        </el-form-item>
        <el-form-item label="项目类型：">
          <el-select v-model="queryCondition.type">
            <el-option :value="0" label="全部" />
            <el-option :value="1" label="2D" />
            <el-option :value="2" label="3D" />
          </el-select>
        </el-form-item>
        <el-button type="primary" @click="searchDataList">筛选</el-button>
        <el-button @click="resetQueryCondition">重置</el-button>
      </el-form>
    </div>
    <div slot="content" class="has-chart-container">
      <div class="table-container">
        <!--      表格列字段名待调整-->
        <el-table v-loading="tableLoading" :data="tableData" style="width: 100%" :max-height="tableMaxHeight" border stripe highlight-current-row>
          <el-table-column prop="id" label="项目编号" min-width="180" align="center" />
          <el-table-column prop="name" label="项目名称" min-width="180" align="center" />
          <el-table-column prop="type" label="项目类型" min-width="100" align="center">
            <template slot-scope="scope">
              {{ scope.row.type === 1 ? '2D' : '3D' }}
            </template>
          </el-table-column>
          <el-table-column prop="status" label="项目状态" min-width="100" align="center">
            <template slot-scope="scope">
              <el-tag :type="changeStatus(scope.row.status, 'type')">{{ changeStatus(scope.row.status, 'value') }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="toBeClaimedCount" label="待领取" min-width="100" align="center" />
          <el-table-column label="我的标注" align="center">
            <el-table-column prop="annotatedCount" label="标注中" min-width="80" align="center">
              <template slot-scope="scope">
                {{ scope.row.annotatedCount || 0 }}
              </template>
            </el-table-column>
            <el-table-column prop="markedCount" label="已标注" min-width="80" align="center">
              <template slot-scope="scope">
                {{ scope.row.markedCount || 0 }}
              </template>
            </el-table-column>
            <el-table-column prop="toBeRepairedCount" label="待返修" min-width="80" align="center">
              <template slot-scope="scope">
                {{ scope.row.toBeRepairedCount || 0 }}
              </template>
            </el-table-column>
            <el-table-column prop="putUpCount" label="已挂起" min-width="80" align="center">
              <template slot-scope="scope">
                {{ scope.row.putUpCount || 0 }}
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="操作" min-width="100" align="center">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="handleDetail(scope.row)"> 详情 </el-button>
            </template>
          </el-table-column>
        </el-table>
        <PaginationComponent v-if="total" :page-index="queryCondition.pageIndex" :page-size="queryCondition.pageSize" :total="total" @pagination="changePage" />
      </div>
      <div class="chart-container">
        <h2>标注工作量统计（当日）</h2>
        <bar-chart :width="480" :height="360" :chart-data-sets="chartDataSets" />
      </div>
    </div>
  </PageContainer>
</template>

<script>
import PaginationComponent from '@/components/PaginationComponent'
import PageContainer from '@/components/PageContainer'
import { getProjectList } from '@/api/task'
import tableMixin from '@/utils/tableMixin'
import BarChart from '@/components/Charts/BarChart'
import { getJobStatusChartData } from '@/api/common'
export default {
  name: 'TaggingTask',
  components: {
    PaginationComponent,
    PageContainer,
    BarChart
  },
  mixins: [tableMixin],
  data() {
    return {
      tableData: [],
      queryCondition: {
        pageIndex: 1,
        pageSize: 20,
        name: '',
        status: 0,
        type: 0,
        distinction: 0
      },
      total: 0,
      tableLoading: false,
      chartDataSets: null
    }
  },
  mounted() {
    this.initPageData()
    this.searchDataList()
  },
  methods: {
    initPageData() {
      this.getTableMaxHeight()
      getJobStatusChartData({ type: 0 }).then((res) => {
        if (res.success) {
          this.chartDataSets = [...res.data]
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 筛选按钮
    searchDataList() {
      this.queryCondition.pageIndex = 1
      this.queryCondition.pageSize = 20
      this.searchProjectDataList()
    },
    // 筛选分页
    searchProjectDataList() {
      this.tableLoading = true
      getProjectList(this.queryCondition)
        .then((res) => {
          this.tableLoading = false
          this.tableData = res.data.records
          this.total = res.data.total
        })
        .catch(() => {
          this.tableLoading = false
        })
    },
    changePage(val) {
      // 分页
      this.queryCondition.pageIndex = val.page
      this.queryCondition.pageSize = val.limit
      this.searchProjectDataList()
    },
    // 判断表格项目状态列数据
    changeStatus(val, sort) {
      let value = ''
      let type = ''
      if (val === 0) {
        value = '未领取'
        type = ''
      } else if (val === 1) {
        value = '进行中'
        type = ''
      } else if (val === 2) {
        value = '验收中'
        type = ''
      } else if (val === 3) {
        value = '已完成'
        type = 'success'
      }
      if (sort === 'value') {
        return value
      } else {
        return type
      }
    },
    // 重置
    resetQueryCondition() {
      this.queryCondition = this.$options.data().queryCondition
      this.searchDataList()
    },
    // 点击详情按钮
    handleDetail(info) {
      this.$router.push({
        name: 'taskDetail',
        params: {
          projectId: info.id
        }
      })
    }
  }
}
</script>

<style scoped lang="scss"></style>
