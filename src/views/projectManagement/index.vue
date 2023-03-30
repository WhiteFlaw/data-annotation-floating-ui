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
            <el-form-item label="项目团队">
              <el-input
                v-model="projectSearchForm.projectGroup"
                placeholder="请选择项目团队" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary">查询</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="4" class="text-align-right">
          <el-button type="primary">新增客户信息</el-button>
        </el-col>
      </el-row>
    </template>
    <template slot="content">
      <el-table />
    </template>
  </page-container>
</template>

<script>
import PageContainer from '@/components/PageContainer'
export default {
  name: 'ProjectManagement',
  components: {
    PageContainer
  },
  data() {
    return {
      projectSearchForm: {
        name: ''
      },
      projectList: [],
      groupList: [],
      customerList: []
    }
  },
  mounted() {
    this.initPageData()
  },
  methods: {
    // 页面初始化
    initPageData() {},
    // 查询项目列表
    queryProjectsData() {}
  }
}
</script>

<style></style>
