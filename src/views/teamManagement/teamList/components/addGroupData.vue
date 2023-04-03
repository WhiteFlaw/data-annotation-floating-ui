<!--
* @FileDescription: 团队管理-团队列表-新增团队
* @Author:Gu Xunqin
* @Date: 2023-03-28
-->
<template>
  <el-dialog
    :visible.sync="dialogVisible"
    destroy-on-close
    :close-on-click-modal="false"
    :title="JSON.stringify(updateData) === '{}' ? '新建团队' : '修改团队名称'"
    width="480px"
    class="el-dialog-border"
  >
    <el-form ref="adGroupForm" :model="addGroupData" :rules="addGroupRules">
      <el-row>
        <el-col>
          <el-form-item label="团队名称" prop="name">
            <el-input v-model="addGroupData.name" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer">
      <el-button type="primary" @click="addGroup">确定</el-button>
      <el-button @click="dialogVisible = false">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {addOrUpdateTeam} from '@/api/teamList'

export default {
  name: 'AddGroupData',
  props: {
    visible: {
      default: false,
      type: Boolean
    },
    updateData: {
      default: () => {},
      type: Object
    }
  },
  data() {
    return {
      addGroupData: {
        name: '' // 团队名称
      }
    }
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible
      },
      set(newVal) {
        return this.$emit('update:visible', newVal)
      }
    },
    addGroupRules() {
      const name = (rule, value, callback) => {
        if (!value) {
          callback('请输入团队名称')
        } else {
          callback()
        }
      }
      return {
        name: [
          { required: true, validator: name, trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.addGroupData = JSON.stringify(this.updateData) !== '{}' ? {...this.updateData} : this.addGroupData
  },
  methods: {
    addGroup() { // 新增按钮方法
      this.$refs['adGroupForm'].validate((valid) => {
        if (valid) {
          addOrUpdateTeam(this.addGroupData).then(res => {
            if (res.msg === 'success') {
              this.$message.success('操作成功！')
              this.$emit('add-or-update-success')
              this.dialogVisible = JSON.stringify(this.updateData) === '{}'
            } else {
              this.$message.error('操作失败！')
            }
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">

</style>
