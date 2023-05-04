<template>
  <el-dialog
    :visible="visible"
    title="分配团队"
    width="480px"
    top="10vh"
    append-to-body
    destroy-on-close
    class="edit-group-form"
    @open="initDialog"
    @close="closeDialog('groupInfoForm')">
    <el-form ref="groupInfoForm" :model="projectGroupEditForm">
      <el-form-item label="选择团队">
        <el-checkbox-group v-model="projectGroupEditForm.teamIds">
          <el-checkbox v-for="g of groupList" :key="g.name" :label="g.id">{{ g.name }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button type="primary" :loading="confirmAssignLoading" @click="confirmAssignProjectToGroup('groupInfoForm')"> 确定 </el-button>
      <el-button type="primary" plain @click="closeDialog('groupInfoForm')"> 取消 </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { assignToGroup } from '@/api/projectManagement'
import { getGroupOptions } from '@/api/common'
export default {
  name: 'AssignToGroupDialog',
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
      projectGroupEditForm: {
        projectId: 0,
        teamIds: []
      },
      confirmAssignLoading: false,
      groupList: []
    }
  },
  methods: {
    // 弹窗初始化
    initDialog() {
      this.projectGroupEditForm = { ...this.editFormData }
      getGroupOptions().then((res) => {
        if (res.success) {
          this.groupList = [...res.data]
        } else {
          this.$$message.error(res.msg)
        }
      })
    },
    // 确认分配团队
    confirmAssignProjectToGroup(formName) {
      this.confirmAssignLoading = true
      this.$refs[formName].validate((valid) => {
        if (valid) {
          assignToGroup(this.projectGroupEditForm).then((res) => {
            if (res.success) {
              this.$message.success(res.msg)
            } else {
              this.$message.error(res.msg)
            }
            this.confirmAssignLoading = false
            this.closeDialog('projectInfoForm')
          })
        } else {
          this.confirmAssignLoading = false
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
.edit-group-form {
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
