<!--
* @FileDescription: 一轮质检 - 项目详情
* @Author: Gu Xunqin
* @Date: 2023-04-17
-->
<template>
  <page-container has-search>
    <template slot="search">
      <el-form inline label-width="90px">
        <el-row>
          <el-col :span="5">
            <el-form-item label="项目名称：">{{ titleData.name }}</el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="项目ID：">{{ titleData.id }}</el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="项目经理：">{{ titleData.managerNickname }}</el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="创建时间：">
              {{ titleData.createdTime ? (titleData.createdTime.indexOf('T') !== -1 ? (titleData.createdTime.split('T')[0] + ' ' + titleData.createdTime.split('T')[1]) : titleData.createdTime) : '' }}
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="项目类型：">
              {{ titleData.type ? (titleData.type === 0 ? '未设定' : (titleData.type === 1 ? '2D' : '3D')) : '' }}
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="标注员：">
              <el-select v-model="searchCondition.userId" filterable placeholder="请选择标注员">
                <el-option :value="0" label="全部" />
                <el-option
                  v-for="(item, i) in teamUserList"
                  :key="i"
                  :label="item.nickname"
                  :value="item.id"
                />
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
        <el-table-column align="center" prop="id" label="任务ID" />
        <el-table-column align="center" prop="name" label="任务名称" />
        <el-table-column align="center" prop="status" label="任务名称">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status === 7?'success' : ''">{{ changeStatus(scope.row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="userNickname" label="标注员" />
        <el-table-column align="center" prop="checkUserNickname" label="一检质检员" />
        <el-table-column align="center" prop="recheckUserNickname" label="二检质检员" />
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="acceptanceTask(scope.row)">验收任务</el-button>
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
import {getRandomDataList, getTeamUserList, queryProjectDetails, queryTaskList} from '@/api/check'

export default {
  name: 'ProjectDetails',
  components: {PaginationComponent, PageContainer},
  mixins: [tableMixin],
  data() {
    return {
      tableLoading: false,
      tableData: [],
      titleData: {},
      page: 1,
      limit: 20,
      searchCondition: {
        checkType: 3, // 验收标识码
        pageSize: 20,
        pageIndex: 1,
        projectId: '' // 项目ID
      },
      teamUserList: [] // 接收团队人员列表
    }
  },
  mounted() {
    this.initPageData()
    this.searchProjectDetails()
    this.search()
  },
  methods: {
    // 页面初始化
    initPageData() {
      this.getTableMaxHeight()
    },
    searchProjectDetails() { // 查询项目详情
      const id = this.$route.query.projectId
      queryProjectDetails(id).then(res => {
        this.titleData = res.data
      })
      getTeamUserList(id).then(res => {
        this.teamUserList = res.data
      })
    },
    search() {
      this.page = 1
      this.limit = 20
      this.searchData()
    },
    changePage(val) { // 分页
      this.page = val.page
      this.limit = val.limit
      this.searchData()
    },
    searchData() { // 查询数据
      this.searchCondition.pageSize = this.limit
      this.searchCondition.pageIndex = this.page
      this.searchCondition.projectId = this.$route.query.projectId
      this.tableLoading = true
      if (this.$route.query.percent) {
        getRandomDataList({...this.searchCondition, percent: this.$route.query.percent}).then(res => {
          this.tableData = res.data.records
          this.tableLoading = false
          this.total = res.data.total
        }).catch(() => {
          this.tableLoading = false
        })
      } else {
        queryTaskList(this.searchCondition).then(res => {
          this.tableData = res.data.records
          this.tableLoading = false
          this.total = res.data.total
        }).catch(() => {
          this.tableLoading = false
        })
      }
    },
    changeStatus(val) { // 判断状态
      let status
      switch (val) {
        case 0:status = '未领取'
          break
        case 1:status = '标注中'
          break
        case 2:status = '一检'
          break
        case 3:status = '二检'
          break
        case 4:status = '待返修'
          break
        case 5:status = '已挂起'
          break
        case 6:status = '待验收'
          break
        case 7: status = '已通过'
          break
        case 8: status = '未通过'
          break
        default:status = ''
      }
      return status
    },
    acceptanceTask(val) { // 验收任务
      const routeUrl = this.$router.resolve({
        name: 'Annotation',
        query: {
          taskId: val.id,
          type: 3
        }
      })
      window.open(routeUrl.href, '_blank')
    },
    // 重置
    resetSearchCondition() {
      this.searchCondition = this.$options.data().searchCondition
      this.search()
    }
  }
}
</script>

<style scoped lang="scss">

</style>
