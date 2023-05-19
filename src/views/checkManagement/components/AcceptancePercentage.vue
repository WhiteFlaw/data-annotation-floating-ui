<!--
* @FileDescription: 验收-验收百分比
* @Author: yang pengfei
* @Date: 2023-04-19
-->
<template>
  <el-dialog
    :visible.sync="dialogVisible"
    destroy-on-close
    :close-on-click-modal="false"
    title="设置验收百分比"
    width="400px"
    class="el-dialog-border"
  >
    <el-form inline>
      <el-row>
        <el-col>
          <el-form-item label="百分比选择" label-width="100px">
            <el-select v-model="percent" filterable placeholder="请选择百分比">
              <el-option :value="10" label="10%" />
              <el-option :value="20" label="20%" />
              <el-option :value="30" label="30%" />
              <el-option :value="40" label="40%" />
              <el-option :value="50" label="50%" />
              <el-option :value="60" label="60%" />
              <el-option :value="70" label="70%" />
              <el-option :value="80" label="80%" />
              <el-option :value="90" label="90%" />
              <el-option :value="100" label="100%" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" :loading="updateLoading" @click="updatePercentage">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'AcceptancePercentage',
  props: {
    visible: {
      default: false,
      type: Boolean
    },
    projectDetails: {
      default: () => {},
      type: Object
    }
  },
  data() {
    return {
      percent: '',
      updateLoading: false
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
    }
  },
  methods: {
    updatePercentage() { // 设置百分比
      this.$router.push({
        name: 'projectDetail',
        query: {
          projectId: this.projectDetails.id,
          percent: this.percent
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep {
  .el-form{
    .el-row{
      .el-col {
        .el-form-item {
          width: 100%;
          .el-form-item__content {
            width: calc(100% - 100px);
            .el-select{
              width: 100%;
            }
          }
        }
      }
    }
  }
}
</style>
