<template>
  <page-container has-search>
    <template slot="search">
      <el-row>
        <el-col :span="22">
          <el-form :model="projectSearchForm" inline class="search-form">
            <el-form-item label="项目名称">
              <el-input v-model="projectSearchForm.projectName" placeholder="请输入项目名称" />
            </el-form-item>
            <el-form-item label="客户名称" prop="customerInfo">
              <el-select v-model="projectSearchForm.customerId" filterable placeholder="按客户查询">
                <el-option :value="null" label="全部" />
                <el-option v-for="customer of customerList" :key="customer.id" :value="customer.id" :label="customer.name" />
              </el-select>
            </el-form-item>
            <el-form-item label="项目团队">
              <el-select v-model="projectSearchForm.teamId" filterable placeholder="按团队查询">
                <el-option :value="null" label="全部" />
                <el-option v-for="team of groupList" :key="team.name" :value="team.id" :label="team.name" />
              </el-select>
            </el-form-item>
            <el-form-item label="项目经理">
              <el-select v-model="projectSearchForm.managerId" filterable placeholder="按项目经理查询">
                <el-option :value="null" label="全部" />
                <el-option v-for="manager of projectManagerList" :key="manager.id" :value="manager.id" :label="manager.nickname" />
              </el-select>
            </el-form-item>
            <el-form-item label="项目状态">
              <el-select v-model="projectSearchForm.status" filterable placeholder="按项目状态查询">
                <el-option :value="null" label="全部" />
                <el-option v-for="status of projectStatusList" :key="status.name" :value="status.id" :label="status.name" />
              </el-select>
            </el-form-item>
            <el-form-item label="项目类型">
              <el-select v-model="projectSearchForm.type" filterable placeholder="按项目类型查询">
                <el-option :value="null" label="全部" />
                <el-option v-for="projectType of projectTypeList" :key="projectType.name" :value="projectType.id" :label="projectType.name" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="queryProjectsData">查询</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="2" class="text-align-right">
          <el-button type="primary" @click="toImportData">创建项目</el-button>
        </el-col>
      </el-row>
    </template>
    <template slot="content">
      <el-table v-loading="tableLoading" :data="projectList" border stripe highlight-current-row :max-height="tableMaxHeight">
        <el-table-column type="selection" width="40" align="center" header-align="center" />
        <el-table-column label="项目编号" prop="id" align="center" header-align="center" width="120" />
        <el-table-column label="项目名称" prop="name" align="center" header-align="center" min-width="180" />
        <el-table-column label="项目经理" prop="managerNickname" align="center" header-align="center" width="120" />
        <el-table-column align="center" label="任务状态" width="400">
          <template slot-scope="scope">
            <span class="el-progress-class progress-container">
              <span class="progress-label">待领取：</span>
              <el-progress
                :percentage="
                  scope.row.taskCount ? (scope.row.taskCount !== 0 ? Number((((scope.row.toBeClaimedCount || 0) / scope.row.taskCount) * 100).toFixed(2)) : 0) : 0
                "
                :format="format(scope.row.toBeClaimedCount, scope.row.taskCount)" />
            </span>
            <span class="el-progress-class progress-container">
              <span class="progress-label">标注中：</span>
              <el-progress
                :percentage="
                  scope.row.taskCount ? (scope.row.taskCount !== 0 ? Number(((((scope.row.taskCount - scope.row.toBeClaimedCount) || 0) / scope.row.taskCount) * 100).toFixed(2)) : 0) : 0
                "
                :format="format(((scope.row.taskCount - scope.row.toBeClaimedCount) || 0), scope.row.taskCount)" />
            </span>
            <span class="el-progress-class progress-container">
              <span class="progress-label">一检：</span>
              <el-progress
                :percentage="
                  scope.row.firstInspectionCount
                    ? scope.row.firstInspectionCount !== 0
                      ? Number((((scope.row.firstInspectingCount || 0) / (scope.row.firstInspectionCount || 0)) * 100).toFixed(2))
                      : 0
                    : 0
                "
                :format="format(scope.row.firstInspectingCount, scope.row.firstInspectionCount)" />
            </span>
            <span class="el-progress-class progress-container">
              <span class="progress-label">二检：</span>
              <el-progress
                :percentage="
                  scope.row.secondInspectionCount
                    ? scope.row.secondInspectionCount !== 0
                      ? Number((((scope.row.secondInspectingCount || 0) / (scope.row.secondInspectionCount || 0)) * 100).toFixed(2))
                      : 0
                    : 0
                "
                :format="format(scope.row.secondInspectingCount, scope.row.secondInspectionCount)" />
            </span>
            <span class="el-progress-class progress-container">
              <span class="progress-label">待验收：</span>
              <el-progress
                :percentage="
                  scope.row.taskCount ? (scope.row.taskCount !== 0 ? Number((((scope.row.atCount || 0) / scope.row.taskCount) * 100).toFixed(2)) : 0) : 0
                "
                :format="format(scope.row.atCount, scope.row.taskCount)" />
            </span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="客户名称" prop="customerName" align="left" header-align="center" min-width="120" /> -->
        <!-- <el-table-column label="项目类型" prop="type" align="center" header-align="center" min-width="70">
          <template slot-scope="scope">
            {{ filterProjectType(Number(scope.row.type)) }}
          </template>
        </el-table-column> -->
        <!-- <el-table-column label="项目状态" prop="status" align="center" header-align="center" min-width="70">
          <template slot-scope="scope">
            <el-tag :type="filterProjectStatus(Number(scope.row.status))['tagType']">{{ filterProjectStatus(Number(scope.row.status))['name'] }}</el-tag>
          </template>
        </el-table-column> -->
        <!-- <el-table-column label="创建人" prop="userNickname" align="center" header-align="center" min-width="100" /> -->
        <!-- <el-table-column label="任务总数" prop="TaggerStatistics" align="center" header-align="center" min-width="80" /> -->
        <!-- <el-table-column label="作业总数" prop="workCount" align="center" header-align="center" min-width="80" /> -->
        <el-table-column label="项目创建时间" prop="createdTime" align="center" width="160" />
        <!-- <el-table-column label="开始日期" prop="startDate" align="center" header-align="center" min-width="100" /> -->
        <!-- <el-table-column label="结束日期" prop="endDate" align="center" header-align="center" min-width="100" /> -->
        <el-table-column label="操作" align="center" header-align="center" min-width="100">
          <template slot-scope="scope">
            <el-button type="text" @click="viewProjectDetail(scope.row)"> 详情 </el-button>
            <el-button type="text" @click="showEditProjectDialog(scope.row)"> 编辑 </el-button>
            <el-button type="text" @click="showAssignToGroupDialog(scope.row)"> 团队 </el-button>
            <el-button type="text" @click="releaseProject(scope.row)"> 释放 </el-button>
            <el-button type="text" @click="deleteProject(scope.row)"> 删除 </el-button>
            <el-button type="text" :loading="exportLoading" :disabled="Number(scope.row.status) !== 3" @click="exportProject(scope.row)"> 导出 </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination-component :total="total" :page-index="pageIndex" :page-size="pageSize" @pagination="changePage" />
      <edit-project-dialog :visible.sync="editProjectDialogShow" :edit-form-data="projectInfoEditForm" @shut-down-dialog="shutDownDialog" />
      <assign-to-group-dialog :visible.sync="editProjectGroupDialogShow" :edit-form-data="projectGroupEditForm" />
    </template>
  </page-container>
</template>

<script>
import PageContainer from '@/components/PageContainer'
import PaginationComponent from '@/components/PaginationComponent'
import EditProjectDialog from '@/views/projectManagement/components/EditProjectDialog'
import AssignToGroupDialog from '@/views/projectManagement/components/AssignToGroupDialog'
import tableMixin from '@/utils/tableMixin'
import { getProjectsList, deleteProjectsList, releaseProjectData, getProjectDetail, exportProjectData } from '@/api/projectManagement'
import { getCustomersOptions, getProjectManagerOptions, getGroupOptions, projectStatusOptions, projectTypeOptions } from '@/api/common'
import { ALL_PROJECT_MANAGER_LIST } from '@/utils/constant'
export default {
  name: 'ProjectManagement',
  components: {
    PageContainer,
    PaginationComponent,
    EditProjectDialog,
    AssignToGroupDialog
  },
  mixins: [tableMixin, ALL_PROJECT_MANAGER_LIST],
  data() {
    return {
      projectSearchForm: {
        customerId: null,
        managerId: null,
        projectName: '',
        status: null,
        teamId: null,
        type: null
      },
      projectList: [],
      tableLoading: false,
      groupList: [],
      customerList: [],
      projectManagerList: [],
      projectStatusList: [],
      projectTypeList: [],
      editProjectDialogShow: false,
      projectInfoEditForm: {},
      editProjectGroupDialogShow: false,
      projectGroupEditForm: {
        projectId: 0,
        teamIds: []
      },
      exportLoading: false
    }
  },
  mounted() {
    this.initPageData()
  },
  methods: {
    // 页面初始化
    initPageData() {
      getCustomersOptions().then((res) => {
        if (res.success) {
          this.customerList = [...res.data]
        } else {
          this.$message.error(res.msg)
        }
      })
      getProjectManagerOptions(ALL_PROJECT_MANAGER_LIST).then((res) => {
        if (res.success) {
          this.projectManagerList = [...res.data]
        } else {
          this.$message.error(res.msg)
        }
      })
      getGroupOptions().then((res) => {
        if (res.success) {
          this.groupList = [...res.data]
        } else {
          this.$message.error(res.msg)
        }
      })
      this.projectStatusList = [...projectStatusOptions]
      this.projectTypeList = [...projectTypeOptions]
      this.queryProjectsData()
      this.getTableMaxHeight()
    },
    // 计算进度条
    format(val1, val2) {
      return () => {
        return (val1 || 0) + '/' + (val2 || 0) + '(' + (Number(val2) !== 0 ? Number((((val1 || 0) / val2) * 100).toFixed(2)) : 0) + '%)'
      }
    },
    // 查询项目列表
    async queryProjectsData() {
      this.tableLoading = true
      try {
        const data = { ...this.projectSearchForm, pageIndex: this.pageIndex, pageSize: this.pageSize }
        const res = await getProjectsList({ ...data })
        if (res.success) {
          const standardDataKeys = [
            'createdTime',
            'customerId',
            'customerName',
            'description',
            'endDate',
            'fromPath',
            'id',
            'name',
            'originalFolder',
            'startDate',
            'status',
            'taskCount',
            'toPath',
            'type',
            'userId',
            'userNickname',
            'workCount'
          ]
          res.data.records.forEach((item) => {
            standardDataKeys.forEach((key) => {
              item[key] = item[key] || ''
              item.createdTime = item.createdTime ? item.createdTime.replace('T', ' ') : ''
            })
          })

          this.projectList = [...res.data.records]
          this.total = res.data.total
        } else {
          this.$message.error(res.msg)
        }
        this.tableLoading = false
      } catch {
        this.tableLoading = false
      }
    },
    // 切换分页
    changePage({ page, limit }) {
      this.pageIndex = page
      this.pageSize = limit
      this.queryProjectsData()
    },
    // 表格内过滤项目状态
    filterProjectStatus(statusId) {
      const value = this.projectStatusList.find((item) => item.id === statusId)
      const tagTypes = ['', 'success', 'info', 'warning', 'danger']
      return {
        name: value.name,
        tagType: tagTypes[value.id]
      }
    },
    // 表格内过滤项目类型
    filterProjectType(typeId) {
      const value = this.projectTypeList.find((item) => item.id === typeId)
      return value.name
    },
    // 查看项目详情
    viewProjectDetail(row) {
      this.$router.push({
        name: 'ProjectManagementDetails',
        query: { id: row.id }
      })
    },
    // 打开编辑项目弹窗
    showEditProjectDialog(row) {
      getProjectDetail(row.id).then((res) => {
        if (res.success) {
          this.editProjectDialogShow = true
          this.projectInfoEditForm = {
            ...res.data,
            customerInfo: `${res.data.customerId}:${res.data.customerName}`,
            selectedDataRange: [res.data.startDate, res.data.endDate],
            selectedGroup: res.data.teamInfoList?.map((item) => item.teamId) ?? [],
            managerInfo: `${res.data.managerId}:${res.data.managerNickname}`,
            oldTeamsId: res.data.teamInfoList?.map((item) => item.teamId) ?? []
          }
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 打开团队编辑弹窗
    showAssignToGroupDialog(row) {
      getProjectDetail(row.id)
        .then((res) => {
          if (res.success) {
            this.editProjectGroupDialogShow = true
            this.projectGroupEditForm = {
              projectId: res.data.id,
              teamIds: res.data.teamInfoList?.map((item) => item.teamId) ?? []
            }
          } else {
            this.$message.error(res.msg)
          }
        })
        .catch(() => {
          this.editProjectGroupDialogShow = true
        })
    },
    // 释放项目
    releaseProject(row) {
      this.$confirm(`确定释放项目（${row.name}）吗?`, '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          releaseProjectData(row.id).then((res) => {
            if (res.success) {
              this.$message.success(res.msg)
              this.queryProjectsData()
            } else {
              this.$message.error(res.msg)
            }
          })
        })
        .catch(() => {
          this.$message.info('已取消删除操作')
        })
    },
    // 删除项目
    deleteProject(row) {
      this.$confirm(`确定删除项目（${row.name}）吗?`, '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteProjectsList(row.id).then((res) => {
            if (res.success) {
              this.$message.success(res.msg)
              this.queryProjectsData()
            } else {
              this.$message.error(res.msg)
            }
          })
        })
        .catch(() => {
          this.$message.info('已取消删除操作')
        })
    },
    // 导出验收完成的项目
    exportProject(row) {
      if (Number(row.status) !== 3) {
        return false
      }
      this.exportLoading = true
      exportProjectData(row.id).then((res) => {
        if (res.success) {
          this.$message.success(res.msg)
        } else {
          this.$message.error(res.msg)
        }
        this.exportLoading = false
      })
    },
    // 跳转数据导入页面
    toImportData() {
      this.$router.push({ name: 'DataManagement' })
    },
    shutDownDialog() {
      this.editProjectDialogShow = false
      this.queryProjectsData()
    }
  }
}
</script>

<style scoped lang="scss">
.search-form.el-form {
  .el-form-item {
    ::v-deep .el-form-item__content {
      .el-input {
        .el-input__inner {
          width: 150px;
        }
      }
    }
  }
}
</style>
