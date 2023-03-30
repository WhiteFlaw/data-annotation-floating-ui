<template>
  <page-container has-search>
    <template slot="search">
      <el-row>
        <el-col :span="20">
          <el-form :model="customerSearchForm" inline>
            <el-form-item label="客户名称">
              <el-input
                v-model="customerSearchForm.name"
                placeholder="请输入客户名称" />
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
      <el-table
        :data="customerList"
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
          label="客户ID"
          prop="id"
          align="center"
          header-align="center"
          min-width="60" />
        <el-table-column
          label="客户名称"
          prop="name"
          align="left"
          header-align="center"
          min-width="120" />
        <el-table-column
          label="客户详情"
          prop="description"
          align="left"
          header-align="center"
          min-width="200" />
        <el-table-column
          label="电话"
          prop="phone"
          align="center"
          header-align="center" />
        <el-table-column
          label="Email"
          prop="email"
          align="center"
          header-align="center" />
        <el-table-column
          label="创建时间"
          prop="createdTime"
          align="center"
          header-align="center"
          min-width="100">
          <template slot-scope="scope">
            {{ scope.row.createdTime.replace('T', ' ') }}
          </template>
        </el-table-column>
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
      <pagination-component
        :total="total"
        :page-index="pageIndex"
        :page-size="pageSize"
        @pagination="changePage" />
    </template>
  </page-container>
</template>

<script>
import PageContainer from '@/components/PageContainer'
import PaginationComponent from '@/components/PaginationComponent'
import { getCustomersList } from '@/api/customerManagement'
export default {
  name: 'CustomerManagement',
  components: {
    PageContainer,
    PaginationComponent
  },
  data() {
    return {
      customerSearchForm: {
        name: ''
      },
      customerList: [],
      total: 0,
      pageIndex: 1,
      pageSize: 20,
      tableMaxHeight: 0
    }
  },
  mounted() {
    this.initPageData()
  },
  methods: {
    // 页面初始化
    async initPageData() {
      await this.queryCustomersData()
      this.$nextTick(()=>{
        const pageContentBoxHeight = document.getElementById('page-content-area').offsetHeight
        this.tableMaxHeight = pageContentBoxHeight - 42
      })
    },
    // 查询客户列表
    async queryCustomersData() {
      const res = await getCustomersList()
      if (res.success) {
        this.customerList = [...res.data]
      } else {
        this.$$message.error(res.msg)
      }
    },
    // 切换分页
    changePage({ page, limit }) {
      this.pagIndex = page
      this.pageSize = limit
    },
    addCustomer() {},
    editCustomerInfo(row) {},
    confirmEditCustomerInfo(info) {},
    deleteCustomer(row) {}
  }
}
</script>

<style></style>
