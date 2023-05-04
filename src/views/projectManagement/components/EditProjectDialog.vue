<template>
  <el-dialog
    :visible="visible"
    title="编辑项目"
    width="640px"
    top="5vh"
    append-to-body
    destroy-on-close
    class="edit-project-form"
    @open="initDialog"
    @close="closeDialog('projectInfoForm')">
    <el-form ref="projectInfoForm" :model="projectInfoEditForm" label-width="80px">
      <el-form-item label="项目名称" prop="name">
        <el-input v-model="projectInfoEditForm.name" placeholder="请输入项目名称" clearable />
      </el-form-item>
      <el-form-item label="客户名称" prop="customerInfo">
        <el-select v-model="projectInfoEditForm.customerInfo" filterable placeholder="请选择客户">
          <el-option v-for="o of customerList" :key="o.id" :value="`${o.id}:${o.name}`" :label="o.name" />
        </el-select>
      </el-form-item>
      <el-form-item label="项目经理" prop="managerInfo">
        <el-select v-model="projectInfoEditForm.managerInfo" filterable placeholder="请选择项目经理">
          <el-option v-for="o of projectManagerList" :key="o.id" :value="`${o.id}:${o.name}`" :label="o.name" />
        </el-select>
      </el-form-item>
      <el-form-item label="导入数据" prop="originalFolder">
        <el-input :value="projectInfoEditForm.originalFolder" disabled />
      </el-form-item>
      <el-form-item label="项目类型" prop="type">
        <el-select v-model="projectInfoEditForm.type" placeholder="请选择项目类型">
          <el-option v-for="t of projectTypeList" :key="t.name" :label="t.name" :value="t.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="项目周期" prop="selectedDataRange">
        <el-date-picker
          v-model="projectInfoEditForm.selectedDataRange"
          type="daterange"
          format="yyyy-MM-dd"
          start-placeholder="起始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd" />
      </el-form-item>
      <el-form-item label="分配团队">
        <el-checkbox-group v-model="projectInfoEditForm.selectedGroup">
          <el-checkbox v-for="g of groupList" :key="g.name" :label="g.id">{{ g.name }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="分包大小" prop="chunkSize">
        <el-input :value="projectInfoEditForm.chunkSize" disabled />
      </el-form-item>
      <el-form-item label="项目描述">
        <el-input
          v-model="projectInfoEditForm.description"
          type="textarea"
          placeholder="请输入项目描述"
          :rows="8"
          resize="none"
          show-word-limit
          maxlength="300" />
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button type="primary" :loading="confirmEditLoading" @click="confirmEditProjectInfo('projectInfoForm')"> 确定 </el-button>
      <el-button type="primary" plain @click="closeDialog('projectInfoForm')"> 取消 </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { assignToGroup, updateProjectsList } from '@/api/projectManagement'
import { getCustomersOptions, getProjectManagerOptions, getGroupOptions, projectStatusOptions, projectTypeOptions } from '@/api/common'
export default {
  name: 'EditProjectDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    editFormData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      projectInfoEditForm: {},
      confirmEditLoading: false,
      groupList: [],
      customerList: [],
      projectManagerList: [],
      projectStatusList: [],
      projectTypeList: []
    }
  },
  methods: {
    // 弹窗初始化
    initDialog() {
      this.projectInfoEditForm = { ...this.editFormData }
      getCustomersOptions().then((res) => {
        if (res.success) {
          this.customerList = [...res.data]
        } else {
          this.$$message.error(res.msg)
        }
      })
      getProjectManagerOptions().then((res) => {
        if (res.success) {
          this.projectManagerList = [...res.data]
        } else {
          this.$$message.error(res.msg)
        }
      })
      getGroupOptions().then((res) => {
        if (res.success) {
          this.groupList = [...res.data]
        } else {
          this.$$message.error(res.msg)
        }
      })
      this.projectStatusList = [...projectStatusOptions]
      this.projectTypeList = [...projectTypeOptions]
    },
    // 确认编辑项目
    confirmEditProjectInfo(formName) {
      this.confirmEditLoading = true
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.projectInfoEditForm.selectedGroup.sort().toString() !== this.projectInfoEditForm.oldTeamsId.sort().toString()) {
            assignToGroup({ projectId: this.projectInfoEditForm.id, teamIds: this.projectInfoEditForm.selectedGroup }).then((res) => {
              if (res.success) {
                this.$message.success(res.msg)
              } else {
                this.$message.error(res.msg)
              }
            })
          }
          updateProjectsList(this.projectInfoEditForm).then((res) => {
            if (res.success) {
              this.$message.success(res.msg)
            } else {
              this.$message.error(res.msg)
            }
            this.confirmEditLoading = false
            this.closeDialog('projectInfoForm')
          })
        } else {
          this.confirmEditLoading = false
          return false
        }
      })
    },
    // 关闭弹窗
    closeDialog(formName) {
      this.$refs[formName].resetFields()
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.edit-project-form {
  .el-checkbox-group {
    max-height: 240px;
    overflow-y: auto;
    border: 1px solid #dcdfe6;
    padding: 3px 10px 0;
    border-radius: 4px;
    line-height: 30px;
  }
}
</style>
