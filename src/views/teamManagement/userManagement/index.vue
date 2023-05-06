<!--
* @FileDescription: 团队管理-用户管理
* @Author: Gu Xunqin
* @Date: 2023-03-28
-->
<template>
  <page-container has-search>
    <template slot="search">
      <el-form inline>
        <el-row>
          <el-col :span="18">
            <el-form-item label="成员:">
              <el-input
                v-model="searchCondition.name"
                placeholder="输入成员"
                clearable
              />
            </el-form-item>
            <el-form-item label="邮箱:">
              <el-input
                v-model="searchCondition.email"
                placeholder="输入邮箱"
                clearable
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="search">筛选</el-button>
              <el-button plain @click="resetQueryCondition">重置</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="6" class="text-align-right">
            <el-button type="primary" icon="el-icon-plus" @click="addUser">新增</el-button>
            <el-button type="primary" icon="el-icon-upload" @click="openUploadDialog">批量导入用户信息</el-button>
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
        <el-table-column align="center" prop="id" label="ID" width="100" />
        <el-table-column align="center" prop="nickname" label="用户名称" min-width="160" />
        <el-table-column align="center" prop="email" label="邮箱" width="200" />
        <el-table-column align="center" label="加入时间" width="160">
          <template slot-scope="scope">
            {{ scope.row.createdTime.indexOf('T') !== -1 ? (scope.row.createdTime.split('T')[0] + ' ' + scope.row.createdTime.split('T')[1]) : scope.row.createdTime }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="账号是否有效" width="130">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status === 1 ? 'info' : 'success'">{{ scope.row.status === 1 ? '无效':'有效' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" min-width="300">
          <template slot-scope="scope">
            <el-button type="text" @click="editInformation(scope.row)">编辑信息</el-button>
            <el-button type="text" :disabled="scope.row.status === 1" @click="roleConfiguration(scope.row)">角色配置</el-button>
            <el-button type="text" :disabled="scope.row.status === 1" @click="deleteData(scope.row)">删除</el-button>
            <el-button type="text" :disabled="scope.row.status === 1" @click="updateUserInvalidation(scope.row)">用户无效化</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination-component
        v-if="total > 0"
        :total="total"
        :page-index.sync="searchCondition.pageIndex"
        :page-size.sync="searchCondition.pageSize"
        @pagination="changePage"
      />
      <template v-if="roleConfigurationVisible"><!--成员角色配置-->
        <role-configuration :visible.sync="roleConfigurationVisible" :row-data="roleConfigurationRowData" />
      </template>
      <template v-if="editInformationVisible"><!--编辑成员信息-->
        <edit-information :visible.sync="editInformationVisible" :row-data="editInformationRowData" @update-success="searchData" />
      </template>
      <template v-if="uploadVisible"><!--批量上传-->
        <member-upload-dialog :visible.sync="uploadVisible" @upload-success="searchData" />
      </template>
      <template v-if="addUserVisible">
        <add-user-information :visible.sync="addUserVisible" @search-data="searchData" />
      </template>
    </template>
  </page-container>
</template>

<script>
import RoleConfiguration from '@/views/teamManagement/userManagement/components/roleConfiguration'
import EditInformation from '@/views/teamManagement/userManagement/components/editInformation'
import MemberUploadDialog from '@/views/teamManagement/userManagement/components/userUploadDialog'
import {deleteUserData, queryUserListData, userInvalidation} from '@/api/userManagement'
import PageContainer from '@/components/PageContainer'
import PaginationComponent from '@/components/PaginationComponent'
import tableMixin from '@/utils/tableMixin'
import AddUserInformation from '@/views/teamManagement/userManagement/components/addUserInformation'
export default {
  name: 'UserManagement',
  components: {
    AddUserInformation,
    PaginationComponent, PageContainer, MemberUploadDialog, EditInformation, RoleConfiguration},
  mixins: [tableMixin],
  data() {
    return {
      searchCondition: {
        name: '', // 名称
        email: '', // 邮箱
        pageSize: 20, // 页码
        pageIndex: 1 // 每页条数
      },
      tableLoading: false,
      tableData: [],
      roleConfigurationRowData: {}, // 角色配置数据
      roleConfigurationVisible: false, //  角色配置visible
      total: 0, // 总条数
      editInformationRowData: {}, // 编辑信息数据
      editInformationVisible: false, //  编辑信息visible
      uploadVisible: false,
      addUserVisible: false
    }
  },
  mounted() {
    this.initPageData()
    this.search()
  },
  methods: {
    resetQueryCondition() { // 重置
      this.searchCondition.name = ''
      this.searchCondition.email = ''
      this.searchCondition.pageIndex = 1
      this.searchCondition.pageSize = 20
      this.search()
    },
    // 页面初始化
    initPageData() {
      this.getTableMaxHeight()
    },
    // 打开成员角色配置
    roleConfiguration(row) {
      this.roleConfigurationRowData = row
      this.roleConfigurationVisible = true
    },
    // 编辑信息
    editInformation(row) {
      this.editInformationRowData = row
      this.editInformationVisible = true
    },
    // 打开上传
    openUploadDialog() {
      this.uploadVisible = true
    },
    changePage(val) { // 分页查询
      this.searchCondition.pageIndex = val.page
      this.searchCondition.pageSize = val.limit
      this.searchData()
    },
    search() { // 查询
      this.searchCondition.pageIndex = 1
      this.searchCondition.pageSize = 20
      this.searchData()
    },
    searchData() { // 查询数据
      this.tableLoading = true
      queryUserListData(this.searchCondition).then(res => {
        this.tableLoading = false
        this.tableData = res.data.records
        this.total = res.data.total
      })
    },
    deleteData(row) { // 删除用户
      this.$confirm(`是否要删除用户：${row.nickname}`, '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteUserData(row).then(res => {
          if (res.msg) {
            this.$message.success(res.msg)
            this.searchData()
          } else {
            this.$message.error('操作失败！')
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    addUser() { // 打开新增用户页面
      this.addUserVisible = true
    },
    updateUserInvalidation(row) { // 用户无效化
      this.$confirm(`是否要无效化用户：${row.nickname}`, '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const updateObject = {...row}
        updateObject.status = 1
        userInvalidation(updateObject).then(res => {
          if (res.msg === '用户无效化成功') {
            this.$message.success(res.msg)
            this.searchData()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '无效化已取消'
        })
      })
    }
  }
}
</script>

<style scoped lang="scss">

</style>
