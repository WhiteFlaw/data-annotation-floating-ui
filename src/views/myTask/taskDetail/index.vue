<!--
* @FileDescription: 我的任务-任务详情
* @Author: guo hongwei
* @Date: 2023-04-07
-->
<template>
  <PageContainer has-search>
    <template slot="search">
      <!--      表单显示待调整-->
      <el-form inline>
        <el-row>
          <el-col :span="6">
            <el-form-item label="项目编号:">{{ info.id }}
              <!-- <el-tag size="mini" effect="dark" type="success">正式</el-tag>  -->
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="项目名称:">
              {{ projectInformation.name }}
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="项目类型:">
              {{ projectInformation.type === 1 ? '2D' : projectInformation.type === 2 ? '3D' : '' }}
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="项目状态:">
              <el-tag :type="projectInformation.status === 3 ? 'success' : ''">{{ changeStatus(projectInformation.status) }}</el-tag>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="创建时间:">
              {{ createdTime }}
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="创建人:">
              {{ projectInformation.userNickname }}
            </el-form-item>
          </el-col>
          <el-col v-if="searchNameVisiable" :span="6">
            <el-form-item label="任务名称：">
              <el-input v-model="recordQueryCondition.taskName" placeholder="输入任务名称进行搜索" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-button v-if="searchNameVisiable" type="primary" size="small" @click="searchTaskList">查询</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="small" @click="claimTask">领取任务</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </template>
    <template slot="content">
      <el-tabs v-model="activeName" @tab-click="searchTaskList">
        <el-tab-pane label="标注中" name="0">
          <!--          表格字段待调整-->
          <el-table v-loading="loading" :data="markTableData" :max-height="tableMaxHeight" style="width: 100%" border stripe highlight-current-row>
            <el-table-column align="center" prop="id" label="任务ID" min-width="120" />
            <el-table-column align="center" prop="name" label="任务名称" min-width="120" />
            <el-table-column align="center" prop="status" label="任务状态" min-width="100">
              <template slot-scope="scope">
                <text v-if="scope.row.status === 0">-</text>
                <el-tag v-else :type="(scope.row.status !== 7 ? '' : 'success')">{{ changeTaskStatus(scope.row.status) }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="任务执行进度:已标注/任务总量" min-width="200" align="center">
              <template slot-scope="scope">
                {{ scope.row.doneCount + '/' + scope.row.totalCount }}
              </template>
            </el-table-column>
            <el-table-column label="操作" min-width="180" align="center">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="taskDetails(scope.row)">详情</el-button>
                <el-button type="text" size="small" @click="taggingTask(scope.row)">{{ scope.row.doneCount === 0 ? '开始标注' : '继续标注' }}</el-button>
              </template>
            </el-table-column>
          </el-table>
          <PaginationComponent
            v-if="markQueryCondition.total"
            :page-index.sync="markQueryCondition.pageIndex"
            :page-size.sync="markQueryCondition.pageSize"
            :total.sync="markQueryCondition.total"
            @pagination="changePage" />
        </el-tab-pane>
        <el-tab-pane label="待返修" name="1">
          <!--          表格字段待调整-->
          <el-table :data="repairTableData" style="width: 100%" :max-height="tableMaxHeight" border stripe highlight-current-row>
            <el-table-column align="center" prop="id" label="任务ID" min-width="120" />
            <el-table-column align="center" prop="name" label="任务名称" min-width="120" />
            <el-table-column align="center" label="操作" min-width="180">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="continueTaggingTask(scope.row)">继续标注</el-button>
              </template>
            </el-table-column>
          </el-table>
          <PaginationComponent
            v-if="repairQueryCondition.total"
            :page-index.sync="repairQueryCondition.pageIndex"
            :page-size.sync="repairQueryCondition.pageSize"
            :total.sync="repairQueryCondition.total"
            @pagination="changePage" />
        </el-tab-pane>
        <el-tab-pane label="我的标注记录" name="2">
          <!--          表格字段待调整-->
          <el-table :data="recordTableData" style="width: 100%" :max-height="tableMaxHeight" border stripe highlight-current-row>
            <el-table-column align="center" prop="id" label="任务ID" min-width="120" />
            <el-table-column align="center" prop="name" label="任务名称" min-width="180" />
            <el-table-column align="center" prop="endTime" label="标注完成时间" min-width="180" />
            <el-table-column align="center" label="任务状态" min-width="180">
              <template slot-scope="scope">
                <el-tag :type="(changeAnnotationRecordStatus(scope.row)=== '一检中'|| changeAnnotationRecordStatus(scope.row)=== '二检中')?'warning' : 'success'">{{ changeAnnotationRecordStatus(scope.row) }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作" min-width="180">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="taskDetails(scope.row)">详情</el-button>
                <el-button type="text" :disabled="!!scope.row.recheckUserId || !!scope.row.checkUserId" @click="updateTask(scope.row)">修改</el-button>
              </template>
            </el-table-column>
          </el-table>
          <PaginationComponent
            v-if="recordQueryCondition.total"
            :page-index.sync="recordQueryCondition.pageIndex"
            :page-size.sync="recordQueryCondition.pageSize"
            :total.sync="recordQueryCondition.total"
            @pagination="changePage" />
        </el-tab-pane>
      </el-tabs>
    </template>
  </PageContainer>
</template>

<script>
import {beginLabel, getProjectDetailInfo, getTaskDataList, jumpVerification} from '@/api/task'
import PaginationComponent from '@/components/PaginationComponent'
import PageContainer from '@/components/PageContainer'
import tableMixin from '@/utils/tableMixin'

export default {
  name: 'TaskDetail',
  components: {
    PaginationComponent,
    PageContainer
  },
  mixins: [tableMixin],
  data() {
    return {
      markQueryCondition: {
        pageIndex: 1,
        pageSize: 20,
        total: 0
      },
      repairQueryCondition: {
        pageIndex: 1,
        pageSize: 20,
        total: 0
      },
      recordQueryCondition: {
        pageIndex: 1,
        pageSize: 20,
        total: 0,
        taskName: ''
      },
      loading: false,
      info: {}, // 接收路由传递数据
      activeName: '0', // TAB选中项
      searchNameVisiable: false,
      markTableData: [], // 标注中表格数据
      repairTableData: [], // 待返修表格数据
      recordTableData: [], // 我的标注记录表格数据
      createdTime: '', // 项目创建时间
      projectIdInPath: null,
      projectInformation: {} // 接收项目信息
    }
  },
  async mounted() {
    this.initPageData()
    await this.searchProjectInformation()
  },
  methods: {
    initPageData() {
      this.getTableMaxHeight(true)
    },
    // 查询项目信息
    async searchProjectInformation() {
      this.info.id = this.$route.params.projectId
      await this.searchTaskList()
      getProjectDetailInfo(this.info.id).then((res) => {
        this.createdTime = res.data.createdTime.replace('T', ' ')
        this.projectInformation = { ...res.data }
      })
    },
    // TAB点击事件 查询表格数据
    async searchTaskList() {
      this.loading = true
      if (this.activeName === '0') {
        this.searchNameVisiable = false
        const obj = await this.searchTaskDataList(this.markQueryCondition, this.markTableData, [1, 5])
        this.markTableData = obj.data
        this.markQueryCondition.total = obj.total
      } else if (this.activeName === '1') {
        this.searchNameVisiable = false
        const obj = await this.searchTaskDataList(this.repairQueryCondition, this.repairTableData, [4])
        this.repairTableData = obj.data
        this.repairQueryCondition.total = obj.total
      } else if (this.activeName === '2') {
        this.searchNameVisiable = true
        const obj = await this.searchTaskDataList(this.recordQueryCondition, this.recordTableData, [2, 3, 6, 7, 8])
        this.recordTableData = obj.data
        this.recordQueryCondition.total = obj.total
      }
      this.loading = false
    },
    // 提取查询表格方法
    async searchTaskDataList(queryCondition, tableData, status) {
      const res = await getTaskDataList({ ...queryCondition, projectId: this.info.id, statusList: status, userId: 0, checkType: 0 })
      return { data: res.data.records, total: res.data.total }
    },
    // 详情
    taskDetails(info) {
      this.$router.push({
        name: 'jobDetail',
        params: {
          taskId: info.id
        }
      })
    },
    // 领取任务
    claimTask() {
      beginLabel(this.info.id).then((res) => {
        if (res.msg === 'success') {
          this.$message.success('操作成功')
          this.searchTaskList()
        } else {
          this.$message({
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    // 标注中 开始标注/继续标注
    taggingTask(info) {
      jumpVerification(info.id, 0).then(res => {
        if (res.msg === 'success') {
          this.$router.push({
            name: 'Annotation',
            query: {
              taskId: info.id,
              type: 0
            }
          })
        } else {
          this.$message.error('有任务正在标注中！')
        }
      })
    },
    // 待验收状态下继续标注不需要领任务
    continueTaggingTask(info) {
      jumpVerification(info.id, 0).then(res => {
        if (res.msg === 'success') {
          this.$router.push({
            name: 'Annotation',
            query: {
              taskId: info.id,
              type: 0
            }
          })
        } else {
          this.$message.error('有任务正在标注中！')
        }
      })
    },
    changeStatus(val) {
      // 判断项目状态
      let status
      switch (val) {
        case 0:
          status = '未领取'
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
          break
      }
      return status
    },
    // 判断任务状态
    changeTaskStatus(val) {
      let taskStatus
      switch (val) {
        case 0:taskStatus = '未领取'
          break
        case 1:taskStatus = '标注中'
          break
        case 2:taskStatus = '一检'
          break
        case 3:taskStatus = '二检'
          break
        case 4:taskStatus = '待返修'
          break
        case 5:taskStatus = '已挂起'
          break
        case 6:taskStatus = '待验收'
          break
        case 7:taskStatus = '已完成'
          break
        case 8:taskStatus = '验收驳回'
          break
        default:
          taskStatus = ''
          break
      }
      return taskStatus
    },
    // 我的标注记录修改任务
    updateTask(val) {
      this.$router.push({
        name: 'Annotation',
        query: {
          taskId: val.id,
          type: 0
        }
      })
    },
    // 我的标注记录 判断任务状态
    changeAnnotationRecordStatus(val) {
      let status
      if (val.status === 2) {
        if (!val.checkUserId) {
          status = '待一检'
        }
        if (val.checkUserId) {
          status = '一检中'
        }
      } else if (val.status === 3) {
        if (!val.recheckUserId) {
          status = '待二检'
        }
        if (val.recheckUserId) {
          status = '二检中'
        }
      } else if (val.status === 6) {
        status = '待验收'
      } else if (val.status === 7) {
        status = '已完成'
      } else if (val.status === 8) {
        status = '验收驳回'
      }
      return status
    },
    changePage(val) { // 分页
      if (this.activeName === '0') {
        this.markQueryCondition.pageIndex = val.page
        this.markQueryCondition.pageSize = val.limit
        this.searchTaskList()
      } else if (this.activeName === '1') {
        this.repairQueryCondition.pageIndex = val.page
        this.repairQueryCondition.pageSize = val.limit
        this.searchTaskList()
      } else if (this.activeName === '2') {
        this.recordQueryCondition.pageIndex = val.page
        this.recordQueryCondition.pageSize = val.limit
        this.searchTaskList()
      }
    }
  }
}
</script>

<style scoped lang="scss">

</style>
