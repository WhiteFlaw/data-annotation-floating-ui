<!--
* @FileDescription: 团队管理-团队列表
* @Author: Gu Xunqin
* @Date: 2023-03-28
-->
<template>
  <page-container has-search>
    <template slot="search">
      <el-form inline>
        <el-row>
          <el-col :span="20">
            <el-form-item label="团队名称:">
              <el-input
                v-model="searchCondition.name"
                placeholder="请输入团队名称"
                clearable
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="search">筛选</el-button>
              <el-button plain @click="resetQueryCondition">重置</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="4" class="text-align-right">
            <el-button type="primary" @click="addOrUpdateGroup()">新建团队</el-button>
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
        <el-table-column prop="id" label="团队编号" />
        <el-table-column prop="name" label="团队名称" />
        <el-table-column prop="userNickname" label="创建人" />
        <el-table-column prop="createdTime" label="创建时间">
          <template slot-scope="scope">
            {{ scope.row.createdTime.indexOf('T') !== -1 ? (scope.row.createdTime.split('T')[0] + ' ' + scope.row.createdTime.split('T')[1]) : scope.row.createdTime }}
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="120px" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" @click="details(scope.row)">详情</el-button>
            <el-button type="text" @click="deleteTeam(scope.row)">删除团队</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination-component
        v-if="total > 0"
        :page-size.sync="searchCondition.pageSize"
        :total.sync="total"
        :page-index.sync="searchCondition.pageIndex"
        @pagination="changePage"
      />
      <template v-if="addGroupVisible">
        <add-group-data :visible.sync="addGroupVisible" @add-or-update-success="searchData" />
      </template>
    </template>
  </page-container>
</template>

<script>
import AddGroupData from '@/views/teamManagement/teamList/components/addGroupData'
import {deleteTeamData, queryTeamListData} from '@/api/teamList'
import PageContainer from '@/components/PageContainer'
import PaginationComponent from '@/components/PaginationComponent'
import tableMixin from '@/utils/tableMixin'

export default {
  name: 'TeamList',
  components: { PaginationComponent, PageContainer, AddGroupData},
  mixins: [tableMixin],
  data() {
    return {
      searchCondition: {
        name: '', // 名称
        pageSize: 20, // 页码
        pageIndex: 1 // 每页条数
      },
      tableLoading: false,
      tableData: [],
      total: 0, // 总条数
      addGroupVisible: false, // 新增
      detailsVisible: false // 详情
    }
  },
  mounted() {
    this.initPageData()
    this.search()
  },
  methods: {
    resetQueryCondition() { // 重置
      this.searchCondition.name = ''
      this.searchCondition.pageIndex = 1
      this.searchCondition.pageSize = 20
      this.search()
    },
    initPageData() {
      this.getTableMaxHeight()
    },
    addOrUpdateGroup() { // 新增
      this.addGroupVisible = true
    },
    details(row) { // 详情
      this.$router.push({
        path: '/teamManagement/team/teamListDetail/teamDetail',
        query: {
          id: row.id
        }
      })
    },
    changePage(val) { // 分页查询
      this.searchCondition.pageIndex = val.page
      this.searchCondition.pageSize = val.limit
      this.searchData()
    },
    search() { // 查询按钮
      this.searchCondition.pageIndex = 1
      this.searchCondition.pageSize = 20
      this.searchData()
    },
    searchData() { // 查询数据
      this.tableLoading = true
      queryTeamListData({...this.searchCondition}).then(res => {
        this.tableLoading = false
        this.tableData = res.data.records
        this.total = res.data.total
      })
    },
    deleteTeam(row) { // 删除团队
      deleteTeamData(row).then(res => {
        if (res.msg === 'success') {
          this.$message.success('操作成功！')
          this.searchData()
        } else {
          this.$message.error('操作失败！')
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">

</style>
