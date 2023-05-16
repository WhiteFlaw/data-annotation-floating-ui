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
            <el-form-item label="项目编号:"> <el-tag size="mini" effect="dark" type="success">正式</el-tag>{{ info.id }} </el-form-item>
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
          <el-col :span="2">
            <el-form-item>
              <el-button type="primary" size="small" @click="handleBegin">开始标注</el-button>
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
                <el-tag v-else :type="scope.row.status === 1 ? '' : 'success'">{{ scope.row.status === 1 ? '标注中' : '已完成' }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="任务执行进度:未标注/任务总量" min-width="200" align="center">
              <template slot-scope="scope">
                {{ scope.row.totalCount - scope.row.doneCount + '/' + scope.row.totalCount }}
              </template>
            </el-table-column>
            <el-table-column label="操作" min-width="180" align="center">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="taskDetails(scope.row)">详情</el-button>
                <el-button type="primary" size="small" @click="handleMark(scope.row)">{{ scope.row.status === 1 ? '开始标注' : '继续标注' }}</el-button>
              </template>
            </el-table-column>
          </el-table>
          <PaginationComponent
            v-if="markQueryCondition.total"
            :page-index="markQueryCondition.pageIndex"
            :page-size="markQueryCondition.pageSize"
            :total="markQueryCondition.total"
            @pagination="searchTaskList" />
        </el-tab-pane>
        <el-tab-pane label="待返修" name="1">
          <!--          表格字段待调整-->
          <el-table :data="repairTableData" style="width: 100%" :max-height="tableMaxHeight" border stripe highlight-current-row>
            <el-table-column align="center" prop="id" label="任务ID" min-width="120" />
            <el-table-column align="center" prop="name" label="任务名称" min-width="120" />
            <el-table-column align="center" label="操作" min-width="180">
              <template slot-scope="scope">
                <el-button type="primary" size="small" @click="handleRepair(scope.row)">继续标注</el-button>
              </template>
            </el-table-column>
          </el-table>
          <PaginationComponent
            v-if="repairQueryCondition.total"
            :page-index="repairQueryCondition.pageIndex"
            :page-size="repairQueryCondition.pageSize"
            :total="repairQueryCondition.total"
            @pagination="searchTaskList" />
        </el-tab-pane>
        <el-tab-pane label="我的标注记录" name="2">
          <!--          表格字段待调整-->
          <el-table :data="recordTableData" style="width: 100%" :max-height="tableMaxHeight" border stripe highlight-current-row>
            <el-table-column align="center" prop="id" label="任务ID" min-width="120" />
            <el-table-column align="center" prop="name" label="任务名称" min-width="180" />
            <el-table-column align="center" prop="endTime" label="标注完成时间" min-width="180" />
            <el-table-column align="center" label="操作" min-width="180">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="taskDetails(scope.row)">详情</el-button>
              </template>
            </el-table-column>
          </el-table>
          <PaginationComponent
            v-if="recordQueryCondition.total"
            :page-index="recordQueryCondition.pageIndex"
            :page-size="recordQueryCondition.pageSize"
            :total="recordQueryCondition.total"
            @pagination="searchTaskList" />
        </el-tab-pane>
      </el-tabs>
    </template>
  </PageContainer>
</template>

<script>
import { beginLabel, getProjectDetailInfo, imitateDoneMark, getTaskDataList } from '@/api/task'
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
        total: 0
      },
      taskId: '', // 将要进行标注的id
      loading: false,
      info: {}, // 接收路由传递数据
      activeName: '0', // TAB选中项
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
        const obj = await this.searchTaskDataList(this.markQueryCondition, this.markTableData, [1, 5])
        this.markTableData = obj.data
        this.markQueryCondition.total = obj.total
      } else if (this.activeName === '1') {
        const obj = await this.searchTaskDataList(this.repairQueryCondition, this.repairTableData, [4])
        this.repairTableData = obj.data
        this.repairQueryCondition.total = obj.total
      } else if (this.activeName === '2') {
        const obj = await this.searchTaskDataList(this.recordQueryCondition, this.recordTableData, [])
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
    // 退回 功能注释  后续看需求调整
    // handleBack(row) {
    //   repairMark({taskId: row.id, status: 0}).then(res => {
    //     if (res.msg === 'success') {
    //       this.$message({
    //         message: '操作成功',
    //         type: 'success'
    //       })
    //       this.searchTaskList()
    //     }
    //   })
    // },
    // 开始标注 功能未完成  后续按需求调整
    handleBegin() {
      beginLabel(this.info.id).then((res) => {
        if (res) {
          this.$message.success('操作成功')
          this.searchTaskList()
          this.taskId = res.data.id
        } else {
          this.$message({
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    handleMark(info) {
      this.$router.push({ name: 'Annotation', query: { taskId: info.id } })
      // this.beginMark(); 暂时隐藏功能未开发 目前是一个模拟标注完成接口，后续删除
      // imitateDoneMark(info.id).then(res => {
      //   if (res.msg === 'success') {
      //     this.$message.success('操作成功')
      //     this.searchTaskList()
      //   }
      // }).catch(() => {
      //   this.searchTaskList()
      // })
    },
    // 待验收状态下继续标注不需要领任务
    handleRepair(info) {
      this.$router.push({ name: 'Annotation', query: { taskId: info.id } })
      // imitateDoneMark(info.id).then(res => {
      //   if (res.msg === 'success') {
      //     this.$message.success('操作成功')
      //   }
      //   this.searchTaskList()
      // }).catch(() => {
      //   this.searchTaskList()
      // })
    },
    // 开始标注动作
    beginMark() {},
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
    }
  }
}
</script>

<style scoped lang="scss">
.btn {
  display: flex;
  justify-content: right;
}
</style>
