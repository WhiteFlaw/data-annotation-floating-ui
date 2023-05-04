<!--
* @FileDescription: 工作台
* @Author: Gu Xunqin
* @Date: 2023-05-04
-->
<template>
  <page-container has-search>
    <template slot="search">
      <el-form inline>
        <el-row>
          <el-col :span="12">
            <el-form-item label="账号：">{{ name }}</el-form-item>
            <el-form-item label="昵称：">{{ nickname }}</el-form-item>
          </el-col>
          <el-col class="text-align-right" :span="12">
            <el-form-item v-if="!itemListFlag" label="总任务数：">{{ taskCount }}</el-form-item>
            <el-button v-if="!itemListFlag" type="primary" @click="returnToPreviousPage">返回</el-button>
          </el-col>
          <el-col v-if="itemListFlag">
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
          <el-col v-if="!itemListFlag && roles === 'teamLeader'">
            <el-tabs v-model="teamId" type="card" @tab-click="handleClick">
              <el-tab-pane v-for="item in tabsList" :key="item.id" :label="item.name" :name="item.id" />
            </el-tabs>
          </el-col>
        </el-row>
      </el-form>
    </template>
    <template slot="content">
      <item-list
        v-if="itemListFlag"
        :table-data="tableData"
        :table-loading="tableLoading"
        @open-details-page="detailedInformation"
      />
      <team-list
        v-if="!itemListFlag && roles === 'manager'"
        :table-data="tableData"
        :table-loading="tableLoading"
      />
      <member-list
        v-if="!itemListFlag && roles === 'teamLeader'"
        :table-data="tableData"
        :table-loading="tableLoading"
        @update-role="updateRole"
      />
      <pagination-component
        v-if="total > 0"
        :page-size.sync="limit"
        :total.sync="total"
        :page-index.sync="page"
        @pagination="changePage"
      />
      <template v-if="updateRoleVisible">
        <update-role-dialog
          :team-id="teamId"
          :visible.sync="updateRoleVisible"
          :row-data="updateRoleObject"
          :status="status"
          @search-data="searchMemberList"
        />
      </template>
    </template>
  </page-container>
</template>

<script>
import {mapGetters} from 'vuex'
import PageContainer from '@/components/PageContainer'
import ItemList from '@/views/dashboard/components/itemList'
import TeamList from '@/views/dashboard/components/teamList'
import MemberList from '@/views/dashboard/components/memberList'
import {queryItemList, queryItemTeamList, queryMemberList, queryTeamList} from '@/api/myWorkbench'
import PaginationComponent from '@/components/PaginationComponent'
import UpdateRoleDialog from '@/views/dashboard/components/updateRoleDialog'

export default {
  name: 'Dashboard',
  components: {UpdateRoleDialog, PaginationComponent, MemberList, TeamList, ItemList, PageContainer},
  data() {
    return {
      tableData: [],
      tableLoading: false,
      itemListFlag: true,
      searchCondition: {
        distinction: '', // 区分标注还是质检(0标注/1质检)
        name: '', // 项目名称
        pageIndex: 1, // 查询页码
        pageSize: 20, // 每页条数
        status: 0, // 状态
        type: 0 // 项目类型
      },
      total: 0,
      page: 1,
      limit: 20,
      rowData: {}, // 项目列表选中数据
      roles: '', // 角色
      tabsList: [], // tabs
      teamId: '', // 团队id
      status: '', // 团队是否有效
      taskCount: 0, // 总任务数
      updateRoleVisible: false,
      updateRoleObject: {} // 角色列表选中数据
    }
  },
  computed: {
    ...mapGetters([
      'name', 'nickname'
    ])
  },
  mounted() {
    this.search()
  },
  methods: {
    search() { // 查询
      this.page = 1
      this.limit = 20
      this.searchItemListData()
    },
    resetSearchCondition() { // 重置查询条件
      this.searchCondition = {
        distinction: '', // 区分标注还是质检(0标注/1质检)
        name: '', // 项目名称
        pageIndex: 1, // 查询页码
        pageSize: 20, // 每页条数
        status: 0, // 状态
        type: 0 // 项目类型
      }
      this.page = 1
      this.limit = 20
      this.searchItemListData()
    },
    searchItemListData() { // 查询数据
      this.searchCondition.pageIndex = this.page
      this.searchCondition.pageSize = this.limit
      this.tableLoading = true
      queryItemList(this.searchCondition).then(res => {
        this.tableLoading = false
        this.tableData = res.data.records
        this.total = res.data.total
      }).catch(() => {
        this.tableData = []
        this.total = 0
        this.tableLoading = false
      })
    },
    changePage(val) { // 分页
      this.page = val.page
      this.limit = val.limit
      if (this.itemListFlag) {
        this.searchItemListData()
      } else if (!this.itemListFlag && this.roles === 'manager') {
        this.searchTeamList()
      } else if (!this.itemListFlag && this.roles === 'teamLeader') {
        this.searchMemberList(this.teamId)
      }
    },
    detailedInformation(val1, val2, val3) { // 项目列表表格操作
      this.rowData = val1
      this.roles = val2
      this.taskCount = val3
      if (this.roles === 'manager') {
        this.page = 1
        this.limit = 20
        this.searchTeamList()
      } else {
        this.page = 1
        this.limit = 20
        this.searchMemberList()
      }
    },
    searchTeamList() { // 查询团队列表
      this.tableLoading = true
      queryTeamList({pageIndex: this.page, pageSize: this.limit, projectId: this.rowData.id}).then(res => {
        this.tableLoading = false
        this.tableData = res.data.records
        this.total = res.data.total
        this.itemListFlag = false
      }).catch(() => {
        this.tableData = []
        this.total = 0
        this.tableLoading = false
        this.itemListFlag = false
      })
    },
    returnToPreviousPage() { // 返回
      this.page = 1
      this.limit = 20
      this.search()
      this.itemListFlag = true
    },
    async searchMemberList(val) { // 查询成员列表
      this.tableLoading = true
      if (!val) {
        try {
          const row = await queryItemTeamList(this.rowData.id)
          row.data.forEach(item => {
            item.id = String(item.id)
          })
          this.tabsList = row.data
          this.teamId = this.tabsList.length ? this.tabsList[0].id : ''
        } catch {
          this.tabsList = []
          this.teamId = ''
        }
      }
      try {
        this.status = this.tabsList.length ? this.tabsList[0].status : ''
        if (this.tabsList.length) {
          this.tabsList.forEach(item => {
            if (item.id === this.teamId) {
              this.status = item.status
            }
          })
        }
        const res = await queryMemberList({pageIndex: this.page, pageSize: this.limit, projectId: this.rowData.id, teamId: Number(this.teamId)})
        this.tableLoading = false
        this.tableData = res.data.records
        this.total = res.data.total
        this.itemListFlag = false
      } catch {
        this.tableData = []
        this.total = 0
        this.tableLoading = false
        this.itemListFlag = false
      }
    },
    handleClick() { // 切换tabs
      this.page = 1
      this.limit = 20
      this.searchMemberList(this.teamId)
    },
    updateRole(val1, val2) {
      this.updateRoleVisible = val1
      this.updateRoleObject = val2
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
