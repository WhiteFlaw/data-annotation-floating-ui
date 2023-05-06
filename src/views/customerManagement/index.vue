<template>
  <page-container has-search>
    <template slot="search">
      <el-row>
        <el-col :span="20">
          <el-form :model="customerSearchForm" inline>
            <el-form-item label="客户名称">
              <el-input v-model="customerSearchForm.customerName" placeholder="按客户名称查询" clearable />
            </el-form-item>
            <el-form-item label="客户电话">
              <el-input v-model="customerSearchForm.customerPhone" placeholder="按客户电话查询" clearable />
            </el-form-item>
            <el-form-item label="客户邮件">
              <el-input v-model="customerSearchForm.customerEmail" placeholder="按客户邮件查询" clearable />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" :loading="tableLoading" @click="queryCustomersData"> 查询 </el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="4" class="text-align-right">
          <el-button type="primary" @click="addCustomer"> 新增客户信息 </el-button>
        </el-col>
      </el-row>
    </template>
    <template slot="content">
      <el-table v-loading="tableLoading" :data="customerList" border stripe highlight-current-row :max-height="tableMaxHeight">
        <el-table-column type="selection" width="40" align="center" />
        <el-table-column label="客户ID" prop="id" align="center" width="100" />
        <el-table-column label="客户名称" prop="name" align="center" width="120" />
        <el-table-column label="客户详情" prop="description" align="center" min-width="200" />
        <el-table-column label="电话" prop="phone" align="center" min-width="100" />
        <el-table-column label="Email" prop="email" align="center" min-width="150" />
        <el-table-column label="创建时间" prop="createdTime" align="center" width="160">
          <template slot-scope="scope">
            {{ scope.row.createdTime.replace('T', ' ') }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" header-align="center" min-width="100" flixd="right">
          <template slot-scope="scope">
            <el-button type="text" @click="editCustomerInfo(scope.row)"> 编辑 </el-button>
            <el-button type="text" @click="deleteCustomer(scope.row)"> 删除 </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination-component :total="total" :page-index="pageIndex" :page-size="pageSize" @pagination="changePage" />
      <el-dialog
        :visible="showEditDialog"
        :title="dialogTitle"
        width="480px"
        top="10vh"
        append-to-body
        destroy-on-close
        @close="closeEditDialog('customerInfoForm')">
        <el-form ref="customerInfoForm" label-width="80px" :close-on-click-modal="false" :model="customerInfoForm" :rules="customerInfoRules">
          <el-form-item label="客户 ID">
            <el-input :value="customerInfoForm.id ? customerInfoForm.id : '系统自动生成'" disabled />
          </el-form-item>
          <el-form-item label="客户名称" prop="name">
            <el-input v-model="customerInfoForm.name" placeholder="请输入客户名称" clearable />
          </el-form-item>
          <el-form-item label="客户电话">
            <el-input v-model="customerInfoForm.phone" placeholder="请输入客户电话号码" clearable />
          </el-form-item>
          <el-form-item label="客户邮件">
            <el-input v-model="customerInfoForm.email" placeholder="请输入客户电子邮件地址" clearable />
          </el-form-item>
          <el-form-item label="客户描述">
            <el-input
              v-model="customerInfoForm.description"
              type="textarea"
              placeholder="请输入客户描述"
              :rows="6"
              resize="none"
              show-word-limit
              maxlength="300" />
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button type="primary" plain @click="closeEditDialog('customerInfoForm')"> 取消 </el-button>
          <el-button type="primary" @click="confirmEditCustomerInfo('customerInfoForm')"> 确定 </el-button>
          <el-button v-if="dialogTitle === '新增客户信息'" type="primary" @click="nueAddCustomer('customerInfoForm')"> 添加并添加下一个 </el-button>
        </div>
      </el-dialog>
    </template>
  </page-container>
</template>

<script>
import PageContainer from '@/components/PageContainer'
import PaginationComponent from '@/components/PaginationComponent'
import { getCustomersList, addOneCustomer, updateCustomer, deleteCustomer } from '@/api/customerManagement'
import tableMixin from '@/utils/tableMixin'
export default {
  name: 'CustomerManagement',
  components: {
    PageContainer,
    PaginationComponent
  },
  mixins: [tableMixin],
  data() {
    return {
      customerSearchForm: {
        customerEmail: '',
        customerName: '',
        customerPhone: ''
      },
      customerList: [],
      tableLoading: false,
      showEditDialog: false,
      ifAdd: false,
      customerInfoForm: {
        createdTime: '',
        description: '',
        email: '',
        id: 0,
        name: '',
        phone: ''
      },
      confirmEditLoading: false
    }
  },
  computed: {
    dialogTitle() {
      return `${this.ifAdd ? '新增' : '编辑'}客户信息`
    },
    customerInfoRules() {
      const rules = {
        name: [{ required: true, message: '客户名称不能为空', trigger: 'blur' }]
      }
      return rules
    }
  },
  mounted() {
    this.initPageData()
  },
  methods: {
    // 页面初始化
    async initPageData() {
      this.queryCustomersData()
      this.getTableMaxHeight()
    },
    // 查询客户列表
    async queryCustomersData() {
      this.tableLoading = true
      const data = {
        ...this.customerSearchForm,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      }
      const res = await getCustomersList({ ...data })
      if (res.success) {
        this.customerList = [...res.data.records]
        this.total = res.data.total
      } else {
        this.$message.error(res.msg)
      }
      setTimeout(() => {
        this.tableLoading = false
      }, 1000)
    },
    // 切换分页
    changePage({ page, limit }) {
      this.pageIndex = page
      this.pageSize = limit
      this.queryCustomersData()
    },
    // 新增客户弹窗
    addCustomer() {
      this.customerInfoForm = {
        createdTime: '',
        description: '',
        email: '',
        id: 0,
        name: '',
        phone: ''
      }
      this.ifAdd = true
      this.showEditDialog = true
    },
    // 编辑客户弹窗
    editCustomerInfo(row) {
      this.customerInfoForm = { ...row }
      this.ifAdd = false
      this.showEditDialog = true
    },
    // 新增、编辑客户确认提交
    confirmEditCustomerInfo(formName) {
      this.confirmEditLoading = true
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.ifAdd) {
            addOneCustomer({ ...this.customerInfoForm }).then((res) => {
              if (res.success) {
                this.$message.success(res.msg)
              } else {
                this.$message.error(res.msg)
              }
              this.confirmEditLoading = false
              this.showEditDialog = false
              this.queryCustomersData()
            })
          } else {
            updateCustomer({ ...this.customerInfoForm }).then((res) => {
              if (res.success) {
                this.$message.success(res.msg)
              } else {
                this.$message.error(res.msg)
              }
              this.confirmEditLoading = false
              this.showEditDialog = false
              this.queryCustomersData()
            })
          }
        } else {
          this.confirmEditLoading = false
          return false
        }
      })
    },
    // 关闭弹窗
    closeEditDialog(formName) {
      this.$refs[formName].resetFields()
      this.showEditDialog = false
    },
    // 删除客户
    deleteCustomer(row) {
      this.$confirm(`确定要删除客户（${row.name}）吗?`, '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteCustomer(row.id).then((res) => {
          if (res.success) {
            this.$message.success(res.msg)
            this.queryCustomersData()
          } else {
            this.$message.error(res.msg)
          }
        })
      }).catch(() => {
        this.$message.info('已取消删除操作')
      })
    },
    nueAddCustomer(formName) { // 添加并添加下一个
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.confirmEditLoading = true
          addOneCustomer({...this.customerInfoForm}).then((res) => {
            if (res.success) {
              this.$message.success(res.msg)
            } else {
              this.$message.error(res.msg)
            }
            this.$refs[formName].resetFields()
            this.confirmEditLoading = false
            this.queryCustomersData()
          })
        }
      })
    }
  }
}
</script>

<style></style>
