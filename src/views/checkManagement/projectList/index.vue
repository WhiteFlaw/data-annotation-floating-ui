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
        <el-table-column prop="id" header-align="center" label="项目ID" min-width="150" />
        <el-table-column prop="name" header-align="center" label="项目名称" min-width="150" />
        <el-table-column prop="managerNickname" align="center" label="项目经理" min-width="120" />
        <el-table-column prop="createdTime" align="center" label="创建时间" min-width="160">
          <template slot-scope="scope">
            {{ scope.row.createdTime.indexOf('T') !== -1 ? (scope.row.createdTime.split('T')[0] + ' ' + scope.row.createdTime.split('T')[1]) : scope.row.createdTime }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" fixed="right" min-width="200">
          <template slot-scope="scope">
            <el-button type="text" @click="openProjectDetails(scope.row)">详情</el-button>
            <el-button type="text" @click="acceptProject(scope.row)">一键验收</el-button>
            <el-button type="text" @click="rejectProject(scope.row)">一键驳回</el-button>
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
    </template>
  </page-container>
</template>

<script>
import PageContainer from '@/components/PageContainer'
import tableMixin from '@/utils/tableMixin'
import PaginationComponent from '@/components/PaginationComponent'
import {checkProject, queryItemDataList} from '@/api/check'
export default {
  name: 'ItemList',
  components: {PaginationComponent, PageContainer},
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
      limit: 20
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
        status: 0, // 状态
        type: 0 // 项目类型
      }
      this.page = 1
      this.limit = 20
      this.searchData()
    },
    acceptProject(info) {
      this.$confirm('确认一键验收此项目吗？')
        .then(_ => {
          checkProject(info.id, {acceptType: 1}).then(res => {
            this.search()
          })
        })
        .catch(_ => {})
    },
    rejectProject(info) {
      this.$confirm('确认一键驳回本项目吗？')
        .then(_ => {
          checkProject(info.id, {acceptType: 2}).then(res => {
            this.search()
          })
        })
        .catch(_ => {})
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
