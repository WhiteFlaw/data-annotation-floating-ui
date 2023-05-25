<!--
* @FileDescription: 二轮质检 - 项目详情
* @Author: Gu Xunqin
* @Date: 2023-04-19
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
          <el-col :span="18">
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
              <el-button plain>重置</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="6" class="text-align-right">
            <el-button :loading="batchCompletionLoading" type="primary" @click="batchCompletion">批量完成</el-button>
            <el-button :loading="batchRejectionLoading" type="primary" @click="batchRejection">批量驳回</el-button>
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
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="60" align="center" />
        <el-table-column min-width="150" align="center" prop="id" label="任务ID" />
        <el-table-column min-width="150" align="center" prop="name" label="任务名称" />
        <el-table-column min-width="100" align="center" prop="status" label="任务状态">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status === 6?'success' : (changeStatus(scope.row) === '二检中' ? 'warning' : '')">{{ changeStatus(scope.row) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column min-width="100" align="center" label="任务执行进度">
          <template slot-scope="scope">
            {{ scope.row.doneCount + '/' + scope.row.totalCount }}
          </template>
        </el-table-column>
        <el-table-column min-width="200" align="center" label="操作">
          <template slot-scope="scope">
            <el-button v-if="!scope.row.recheckUserId" type="text" :disabled="!!scope.row.recheckUserId" @click="receiveQualityInspection(scope.row)">领取质检</el-button>
            <el-button v-if="scope.row.recheckUserId" type="text" :disabled="!scope.row.recheckUserId || scope.row.recheckUserId !== userId" @click="continuedQualityInspection(scope.row)">继续质检</el-button>
            <el-button type="text" :disabled="!scope.row.recheckUserId" @click="completionOfSecondInspection(scope.row)">二检完成</el-button>
            <el-button type="text" :disabled="!scope.row.recheckUserId" @click="rejectTheTaskData(scope.row)">二检驳回</el-button>
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
import PaginationComponent from '@/components/PaginationComponent'
import tableMixin from '@/utils/tableMixin'
import {
  getTeamUserList,
  queryProjectDetails,
  queryTaskList,
  receiveQualityInspectionTask, rejectTheTask, updateCompletionOfFirstInspection
} from '@/api/roundOfInspection'
import {mapGetters} from 'vuex'
export default {
  name: 'SecondProjectDetails',
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
        checkType: 2,	// 标注0/一检1/二检2
        pageSize: 20,
        pageIndex: 1,
        projectId: '', // 项目ID
        statusList: [3],
        userId: 0 // 标注员ID
      },
      teamUserList: [], // 接收团队人员列表
      batchRejectionLoading: false,
      batchCompletionLoading: false,
      selectList: []
    }
  },
  computed: {
    // 获取登陆人Id
    ...mapGetters(['userId'])
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
      queryTaskList(this.searchCondition).then(res => {
        this.tableData = res.data.records
        this.tableLoading = false
        this.total = res.data.total
      }).catch(() => {
        this.tableLoading = false
      })
    },
    changeStatus(val) { // 判断状态
      let status
      switch (val.status) {
        case 0:status = '未领取'
          break
        case 1:status = '标注中'
          break
        case 2:status = '一检'
          break
        case 3:
          if (val.recheckUserId) {
            status = '二检中'
          } else if (!val.recheckUserId) {
            status = '待二检'
          }
          break
        case 4:status = '待返修'
          break
        case 5:status = '已挂起'
          break
        case 6:status = '待验收'
          break
        default:status = '已完成'
      }
      return status
    },
    receiveQualityInspection(val) { // 领取质检
      receiveQualityInspectionTask(Number(val.id), 2).then(res => {
        if (res.msg === 'success') {
          this.$message.success('操作成功！')
          this.searchData()
          this.$router.push({
            name: 'Annotation',
            query: {
              taskId: val.id,
              type: 2
            }
          })
        }
      })
    },
    completionOfSecondInspection(val) { // 二检完成
      const dataList = []
      dataList.push(val.id)
      updateCompletionOfFirstInspection(dataList, 2).then(res => {
        if (res.msg === 'success') {
          this.$message.success('操作成功！')
          this.searchData()
        }
      })
    },
    rejectTheTaskData(val) { // 二检驳回
      const dataList = []
      dataList.push(val.id)
      rejectTheTask(dataList, 2).then(res => {
        if (res.msg === 'success') {
          this.$message.success('操作成功！')
          this.searchData()
        }
      })
    },
    continuedQualityInspection(val) {
      this.$router.push({
        name: 'Annotation',
        query: {
          taskId: val.id,
          type: 2
        }
      })
    },
    handleSelectionChange(val) { // 勾选
      this.selectList = val
    },
    batchCompletion() { // 批量完成
      if (!this.selectList.length) {
        this.$message.error('请选择任务！')
        return
      }
      const selectDataList = this.selectList.map(item => {
        return item.id
      })
      updateCompletionOfFirstInspection(selectDataList, 2).then(res => {
        if (res.msg === 'success') {
          this.$message.success('操作成功！')
          this.searchData()
        }
      })
    },
    batchRejection() { // 批量驳回
      if (!this.selectList.length) {
        this.$message.error('请选择任务！')
        return
      }
      const selectDataList = this.selectList.map(item => {
        return item.id
      })
      rejectTheTask(selectDataList, 2).then(res => {
        if (res.msg === 'success') {
          this.$message.success('操作成功！')
          this.searchData()
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
