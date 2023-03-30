<template>
  <page-container has-search>
    <template slot="search">
      <el-row>
        <el-col :span="20">
          <el-form :model="projectSearchForm" inline>
            <el-form-item label="项目名称">
              <el-input
                v-model="projectSearchForm.projectName"
                placeholder="请输入项目名称" />
            </el-form-item>
            <el-form-item label="客户名称" prop="customerInfo">
              <el-select
                v-model="projectSearchForm.customerInfo"
                filterable
                placeholder="请选择客户">
                <el-option
                  v-for="o of customerList"
                  :key="o.id"
                  :value="`${o.id}:${o.name}`"
                  :label="o.name" />
              </el-select>
            </el-form-item>
            <el-form-item label="项目团队">
              <el-select
                v-model="projectSearchForm.customerInfo"
                filterable
                placeholder="请选择团队">
                <el-option
                  v-for="g of groupList"
                  :key="g.key"
                  :value="g.id"
                  :label="g.name" />
              </el-select>
            </el-form-item>
            <el-form-item label="项目经理">
              <el-select
                v-model="projectSearchForm.customerInfo"
                filterable
                placeholder="请选择项目经理">
                <el-option
                  v-for="g of groupList"
                  :key="g.key"
                  :value="g.id"
                  :label="g.name" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary">查询</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </template>
    <template slot="content">
      <el-table
        :data="projectList"
        border
        stripe
        highlight-current-row
        :max-height="tableMaxHeight">
        <el-table-column
          type="selection"
          width="50"
          align="center"
          header-align="center" />
        <el-table-column
          label="项目ID"
          prop="id"
          align="center"
          header-align="center"
          min-width="60" />
        <el-table-column
          label="项目名称"
          prop="id"
          align="center"
          header-align="center"
          min-width="120" />
        <el-table-column
          label="客户名称"
          prop="name"
          align="left"
          header-align="center"
          min-width="120" />
        <el-table-column
          label="团队名称"
          prop="name"
          align="left"
          header-align="center"
          min-width="120" />
        <el-table-column
          label="项目经理"
          prop="name"
          align="left"
          header-align="center"
          min-width="120" />
        <el-table-column
          label="项目状态"
          prop="name"
          align="left"
          header-align="center"
          min-width="100" />
        <el-table-column
          label="创建/更新时间"
          prop="name"
          align="left"
          header-align="center"
          min-width="100" />
        <el-table-column label="操作" align="left" header-align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="editCustomerInfo(scope.row)">
              编辑
            </el-button>
            <el-button type="text" @click="deleteCustomer(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
  </page-container>
</template>

<script>
import PageContainer from '@/components/PageContainer'
import tableMixin from '@/utils/tableMixin'
export default {
  name: 'ProjectManagement',
  components: {
    PageContainer
  },
  mixins: [tableMixin],
  data() {
    return {
      projectSearchForm: {
        name: ''
      },
      projectList: [],
      groupList: [],
      customerList: [],
      projectManagerList: [],
      projectStatusList: []
    }
  },
  mounted() {
    this.initPageData()
  },
  methods: {
    // 页面初始化
    initPageData() {
      this.getTableMaxHeight()
    },
    // 查询项目列表
    queryProjectsData() {}
  }
}
</script>

<style></style>
