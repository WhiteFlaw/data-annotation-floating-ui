<template>
  <page-container>
    <template slot="content">
      <el-form
        ref="dataForm"
        label-width="80px"
        :model="dataForm"
        :rules="rules">
        <el-form-item label="项目名称" prop="projectName">
          <el-input
            v-model="dataForm.projectName"
            placeholder="请输入项目名称" />
        </el-form-item>
        <el-form-item label="客户名称" prop="customerInfo">
          <el-select
            v-if="customerList.length"
            v-model="dataForm.customerInfo"
            placeholder="请选择要导入的项目数据">
            <el-option
              v-for="o of customerList"
              :key="o.id"
              :value="`${o.id}:${o.name}`"
              :label="o.name" />
          </el-select>
          <div v-else class="has-no-group">
            <span>尚未创建客户列表</span>
            <router-link to="/">去创建</router-link>
          </div>
        </el-form-item>
        <el-form-item label="导入数据" prop="selectedProjectData">
          <el-select
            v-model="dataForm.selectedProjectData"
            placeholder="请选择要导入的项目数据">
            <el-option
              v-for="o of projectDataList"
              :key="o.projectFolderName"
              :value="o.projectFolderName"
              :label="o.projectFolderName" />
          </el-select>
        </el-form-item>
        <el-form-item label="项目周期" prop="selectedDataRange">
          <el-date-picker
            v-model="dataForm.selectedDataRange"
            type="daterange"
            format="yyyy-MM-dd"
            start-placeholder="起始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd" />
        </el-form-item>
        <el-form-item label="分配团队" prop="selectedGroup">
          <el-checkbox-group
            v-if="groupList.length"
            v-model="dataForm.selectedGroup">
            <el-checkbox v-for="g of groupList" :key="g.key" :label="g.id">{{
              g.name
            }}</el-checkbox>
          </el-checkbox-group>
          <div v-else class="has-no-group">
            <span>尚未创建团队</span>
            <router-link to="/">去创建</router-link>
          </div>
        </el-form-item>
        <el-form-item label="分包大小" prop="chunkSize">
          <el-input-number v-model="dataForm.chunkSize" :min="1" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="confirmDataInit('dataForm')">
            导入初始化
          </el-button>
          <el-button type="primary" plain @click="resetForm('dataForm')">
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </template>
  </page-container>
</template>

<script>
import PageContainer from '@/components/PageContainer'
import {
  getCustomersList,
  getProjectDataList,
  getTeamsList,
  confirmInitData
} from '@/api/dataManagement'
export default {
  name: 'DataManagement',
  components: { PageContainer },
  data() {
    return {
      groupList: [],
      projectDataList: [],
      customerList: [],
      dataForm: {
        projectName: '',
        customerInfo: '',
        selectedProjectData: '',
        selectedDataRange: [],
        selectedGroup: [],
        chunkSize: 10
      }
    }
  },
  computed: {
    rules() {
      const rules = {
        projectName: [
          { required: true, message: '请输入项目名称', trigger: 'blur' }
        ],
        customerInfo: [
          { required: true, message: '请输入客户名称', trigger: 'blur' }
        ],
        selectedProjectData: [
          {
            required: true,
            message: '请选择要导入的项目数据',
            trigger: 'change'
          }
        ],
        selectedDataRange: [
          {
            required: true,
            message: '起始时间和结束时间均不能为空',
            trigger: 'change'
          }
        ],
        selectedGroup: [
          { required: true, message: '请选择团队', trigger: 'change' }
        ],
        chunkSize: [
          { required: true, message: '分包大小最小为1', trigger: 'blur' }
        ]
      }
      return rules
    }
  },
  mounted() {
    this.initPageData()
  },
  methods: {
    // 页面初始化，请求项目数据列表，客户列表，团队列表
    async initPageData() {
      getProjectDataList().then((res) => {
        if (res.success) {
          this.projectDataList = [...res.data]
        }
      })
      getCustomersList().then((res) => {
        if (res.success) {
          this.customerList = [...res.data]
        }
      })
      getTeamsList().then((res) => {
        this.groupList = [...res.data]
      })
    },
    // 确定提交初始化数据
    confirmDataInit(formName) {
      const postData = {
        chunkSize: this.dataForm.chunkSize,
        customerId: Number(this.dataForm.customerInfo.split(':')[0]),
        customerName: this.dataForm.customerInfo.split(':')[1],
        endDate: this.dataForm.selectedDataRange[1],
        projectFolderName: this.dataForm.selectedProjectData,
        projectName: this.dataForm.projectName,
        startDate: this.dataForm.selectedDataRange[0],
        teamIds: this.dataForm.selectedGroup
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(3333)
          confirmInitData({ ...postData })
        } else {
          return false
        }
      })
    },
    // 清空表单
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
.el-form {
  width: 600px;

  .el-form-item {
    .el-select,
    .el-date-editor {
      width: 100%;
    }

    .has-no-group {
      background: #f7f7f7;
      padding: 0 10px;

      span {
        color: #999999;
        margin-right: 10px;
      }
      a {
        color: #409eff;
      }
    }

    .el-checkbox-group {
      max-height: 240px;
      overflow-y: auto;
      border: 1px solid #dcdfe6;
      padding: 3px 10px 0;
      border-radius: 4px;
      line-height: 30px;
    }
  }
}
</style>
