<template>
  <page-container has-search>
    <template slot="search">
      <el-form>
        <el-row>
          <el-col>
            <span class="team-name">{{ detailsData.name }}</span>
            <el-button :disabled="detailsData.status === 1" icon="el-icon-edit" type="text" @click="addOrUpdateGroup()" />
            <el-button type="text" @click="backPage">返回团队列表</el-button>
          </el-col>
          <el-col :span="8">
            <el-form-item label="创建人:">{{ detailsData.userNickname }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="团队人数:">{{ total }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="创建时间:">{{ detailsData.createdTime ? (detailsData.createdTime.indexOf('T') !== -1 ? (detailsData.createdTime.split('T')[0] + ' ' + detailsData.createdTime.split('T')[1]) : detailsData.createdTime) : '' }}</el-form-item>
          </el-col>
          <el-col>
            <el-tabs v-model="activeName" type="card" @tab-click="changeTabs">
              <el-tab-pane label="所有" name="0" />
              <el-tab-pane v-for="item in teamRole" :key="item.id" :label="item.name" :name="item.id" />
              <el-form inline>
                <el-row>
                  <el-col :span="activeName === '0' ? 22 : 20">
                    <el-form-item v-if="activeName === '0'">
                      <el-radio-group v-model="roleId">
                        <el-radio v-for="item in teamRole" :key="item.id" :label="item.id">{{ item.name }}</el-radio>
                      </el-radio-group>
                    </el-form-item>
                    <el-form-item :class="activeName === '0' ? 'select-form' : 'select-width-100'">
                      <el-select v-model="checkList" filterable placeholder="请选择添加的成员" multiple>
                        <el-option
                          v-for="(item, i) in userList"
                          :key="i"
                          :label="item.nickname"
                          :value="item.id + ',' + item.createdTime"
                        >
                          <span class="name">{{ item.nickname }}</span>
                          <span class="email">{{ item.email }}</span>
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="activeName === '0' ? 2 : 4" class="text-align-right">
                    <el-button type="primary" :disabled="detailsData.status === 1" @click="addUserRoles">
                      {{ activeName === '0' ? '添加' : activeName === '3' ? '添加团队管理员': activeName === '4' ? '添加质检员' : '添加标注员' }}
                    </el-button>
                  </el-col>
                </el-row>
              </el-form>
            </el-tabs>
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
        <el-table-column prop="userId" label="用户ID" />
        <el-table-column prop="nickName" label="昵称" />
        <el-table-column prop="email" label="用户邮箱" />
        <el-table-column prop="roleId" label="角色">
          <template slot-scope="scope">
            {{ changeRoles(scope.row.roleId) }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="searchInformation(scope.row)">查看信息</el-button>
            <el-button type="text" :disabled="detailsData.status === 1" @click="updateData(scope.row)">修改角色</el-button>
            <el-button type="text" :disabled="detailsData.status === 1" @click="deleteRowData(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination-component
        v-show="totalAll"
        :page-size.sync="pageSizeAll"
        :page-index.sync="pageIndexAll"
        :total.sync="totalAll"
        @pagination="changeDetailsPage"
      />
      <template v-if="roleConfigurationVisible">
        <role-configuration :team-role="teamRole" :row-data="memberDetails" :visible.sync="roleConfigurationVisible" @search-data-list="searchDetailData" />
      </template>
      <template v-if="detailedVisible">
        <edit-information :row-data="detailedInformation" :visible.sync="detailedVisible" />
      </template>
      <template v-if="addGroupVisible">
        <add-group-data :update-data="detailsData" :visible.sync="addGroupVisible" @add-or-update-success="searchTitleData" />
      </template>
    </template>
  </page-container>
</template>

<script>
import PageContainer from '@/components/PageContainer'
import PaginationComponent from '@/components/PaginationComponent'
import EditInformation from '@/views/teamManagement/teamList/components/editInformation'
import RoleConfiguration from '@/views/teamManagement/teamList/components/roleConfiguration'
import tableMixin from '@/utils/tableMixin'
import {deleteUserRoleData, getUserRole, queryRoleList} from '@/api/userManagement'
import {addOrUpdateUserData, queryTeamDetail, queryTeamRolesData, queryUserData} from '@/api/teamList'
import AddGroupData from '@/views/teamManagement/teamList/components/addGroupData'
export default {
  name: 'TeamDetail',
  components: {AddGroupData, PageContainer, PaginationComponent, EditInformation, RoleConfiguration},
  mixins: [tableMixin],
  data() {
    return {
      teamRole: [],
      tableLoading: false,
      addGroupVisible: false,
      tableData: [],
      total: 0,
      total1: 0,
      total2: 0,
      roleId: '3', // 角色选择
      pageSize: 20,
      pageSize1: 20,
      pageSize2: 20,
      pageIndex: 1,
      pageIndex1: 1,
      pageIndex2: 1,
      activeName: '0',
      checkList: [], // 下拉选择用户
      userList: [], // 成员下拉列表
      roleConfigurationVisible: false, // 修改角色
      memberDetails: {},
      detailedInformation: {}, // 详细信息查询条件
      detailedVisible: false, // 控制详细信息是否展示
      rolesList: [], // 接收角色列表
      detailsData: {}
    }
  },
  computed: {
    totalAll() {
      return this.activeName === '0' ? this.total : (this.activeName === '3' ? this.total1 : this.total2)
    },
    pageSizeAll() {
      return this.activeName === '0' ? this.pageSize : (this.activeName === '3' ? this.pageSize1 : this.pageSize2)
    },
    pageIndexAll() {
      return this.activeName === '0' ? this.pageIndex : (this.activeName === '3' ? this.pageIndex1 : this.pageIndex2)
    }
  },
  async mounted() {
    await this.searchTitleData()
    const res = await queryRoleList() // 查询角色列表
    this.rolesList = res.data
    this.searchUserData()
    this.searchDetailData()
    this.initPageData()
  },
  methods: {
    initPageData() {
      this.getTableMaxHeight()
    },
    async searchTitleData() {
      const id = this.$route.query.id
      const row = await queryTeamDetail({teamId: id})
      const res = await getUserRole(id) // 根据团队id获取角色配置
      res.data.forEach(item => {
        item.id = String(item.id)
      })
      this.teamRole = res.data
      this.detailsData = row.data
    },
    addOrUpdateGroup() { // 编辑
      this.addGroupVisible = true
    },
    changeTabs() { // 切换tab页
      this.searchDetailData()
    },
    searchUserData() { // 查询未分配用户列表
      queryUserData({teamId: this.detailsData.id}).then(res => {
        this.userList = res.data
      })
    },
    searchDetailData() { // 查询团队列表信息
      this.tableLoading = true
      queryTeamRolesData({roleId: Number(this.activeName), teamId: this.detailsData.id, pageIndex: this.pageIndexAll, pageSize: this.pageSizeAll}).then(res => {
        this.tableLoading = false
        this.tableData = res.data.records
        this.activeName === '0' ? this.total = res.data.total : (this.activeName === '3' ? this.total1 = res.data.total : this.total2 = res.data.total)
      }).catch(() => {
        this.tableLoading = false
      })
    },
    changeDetailsPage(val) { // 分页查询
      this.activeName === '0' ? this.pageIndex = val.page : (this.activeName === '3' ? this.pageIndex1 = val.page : this.pageIndex2 = val.page)
      this.activeName === '0' ? this.pageSize = val.limit : (this.activeName === '3' ? this.pageSize1 = val.limit : this.pageSize2 = val.limit)
      this.searchDetailData()
    },
    backPage() { // 返回团队列表
      this.$router.go(-1)
    },
    searchInformation(row) { // 查看信息
      this.detailedVisible = true
      this.detailedInformation = row
    },
    addUserRoles() { // 为团队新增成员
      const addUserList = []
      this.checkList.forEach(item => {
        addUserList.push(
          {
            teamId: this.detailsData.id,
            userId: Number(item.split(',')[0]),
            createdTime: item.split(',')[1],
            roleId: this.activeName === '0' ? Number(this.roleId) : Number(this.activeName)
          }
        )
      })
      if (addUserList.length) {
        addOrUpdateUserData(addUserList).then(res => {
          if (res.msg === 'success') {
            this.$message.success('操作成功！')
            this.searchDetailData()
            this.searchUserData()
            this.checkList = []
          } else {
            this.$message.error('操作失败！')
          }
        })
      } else {
        this.$message.error('请选择要添加的成员！')
      }
    },
    changeRoles(val) { // 判断角色
      let rolesName = ''
      this.rolesList.forEach(item => {
        if (item.id === val) {
          rolesName = item.name
        }
      })
      return rolesName
    },
    updateData(row) { // 修改角色
      this.memberDetails = row
      this.roleConfigurationVisible = true
    },
    deleteRowData(row) { // 删除
      const h = this.$createElement
      this.$confirm('', {
        message: h('div', null, [
          h('i', { class: 'el-icon-question', style: 'color:#f90;font-size:30px;' }),
          h('span', { style: 'margin-left:10px;font-size:16px;line-height:30px;font-weight:600;vertical-align:top;'}, '确定要删除这个用户?'),
          h('p', { style: 'margin:0 0 0 40px; font-weight: bold;' },
            `用户名称: ${row.nickName}`
          ),
          h('p', { style: 'margin:0 0 0 40px; font-weight: bold;' },
            `当前角色: ${this.changeRoles(row.roleId)}`
          ),
          h('p', { style: 'margin:0 0 0 40px;' },
            '确定删除的话，用户会被移出团队。'
          ),
          h('p', { style: 'margin:0 0 0 40px;' },
            'Ta未完成的工作将被重新分配'
          )
        ]),
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'del-model',
        dangerouslyUseHTMLString: true,
        closeOnClickModal: false,
        closeOnPressEscape: false
      }).then(() => {
        const updateObject = {
          id: row.id,
          roleId: row.roleId,
          teamId: row.teamId,
          userId: row.userId,
          createdTime: row.createdTime
        }
        deleteUserRoleData(updateObject).then(res => {
          if (res.msg === 'success') {
            this.$message.success('操作成功！')
            this.searchDetailData()
            this.searchUserData()
          } else {
            this.$message.error('操作失败！')
          }
        })
      }).catch(() => {
        this.$message.info('删除已取消！')
      })
    }
  }
}
</script>

<style scoped lang="scss">
.el-select-dropdown__item{
  height: 40px;
  display: flex;
  flex-direction: column;
  span{
    line-height: 20px;
  }
  .name{
    font-size: 14px;
  }
  .email{
    font-size: 12px;
    color: #909399;
  }
}
.team-name{
  font-size: 18px;
  font-weight: bold;
  margin-right: 10px;
}
::v-deep .el-form {
  .el-row {
    .el-col{
      .el-form-item {
        margin-bottom: 5px;
      }
      .select-form{
        width: calc(100% - 306px);
        .el-form-item__content{
          width: 100%;
          .el-select{
            width: 100%;
            .el-input {
              width: 100%;
              .el-input__inner {
                width:100%;
              }
            }
          }
        }
      }
      .select-width-100{
        width: 100%;
        .el-form-item__content{
          width: 100%;
          .el-select{
            width: 100%;
            .el-input {
              width: 100%;
              .el-input__inner {
                width:100%;
              }
            }
          }
        }
      }
    }
  }
}
</style>
