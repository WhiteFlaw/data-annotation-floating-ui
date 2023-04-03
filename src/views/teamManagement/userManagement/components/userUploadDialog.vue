<!--
* @FileDescription: 团队管理-用户管理-批量上传
* @Author: Gu Xunqin
* @Date: 2023-03-28
-->
<template>
  <el-dialog
    :visible.sync="dialogVisible"
    destroy-on-close
    :close-on-click-modal="false"
    title="批量导入成员信息"
    width="480px"
    class="el-dialog-border"
  >
    <upload-dialog ref="uploadDialog" @upload-file="uploadFile">
      <template v-slot:header>
        <p>1、点击下载
          <el-button
            type="text"
            class="text-button"
            @click="downloadExcel()"
          >
            批量导入成员信息模板
          </el-button>
        </p>
        <p>2、编辑保存之后，在下方的导入区域内选择该文件进行导入</p>
        <p>3、点击确定，开始上传</p>
      </template>
    </upload-dialog>
    <div slot="footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" :loading="uploadLoading" @click="uploadData">确定</el-button>
      <a />
    </div>
  </el-dialog>
</template>

<script>
import UploadDialog from '@/components/Upload'
import {uploadUserData} from '@/api/userManagement'
export default {
  name: 'MemberUploadDialog',
  components: {UploadDialog},
  props: {
    visible: {
      default: false,
      type: Boolean
    }
  },
  data() {
    return {
      uploadDataObject: {},
      uploadLoading: false
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
    downloadExcel() { // 下载上传模板
      const a = document.createElement('a')
      a.href = './static/uploadTemplate/UploadTemplate.xlsx'
      a.download = '批量导入成员信息 (模板)'
      a.click()
    },
    uploadFile(params) { // 存储解析的数据
      this.uploadDataObject = params
    },
    uploadData() { // 上传数据
      if (JSON.stringify(this.uploadDataObject) === '{}') {
        this.$message.error('请选择文件！')
        return false
      }
      const columnMap = {
        'name': '账号',
        'password': '密码',
        'nickname': '成员名称',
        'email': '成员邮箱',
        'gender': '性别',
        'age': '年龄',
        'education': '学历',
        'socialSeniority': '社会工龄',
        'labelSeniority': '标注工龄',
        'labelProExp': '标注项目经验',
        'englishLevel': '英语水平'
      }
      const uploadData = this.uploadDataObject.result.map(item => {
        const obj = {}
        this.uploadDataObject.header.forEach(key => {
          obj[Object.keys(columnMap).find(k => columnMap[k] === key)] = item[key]
        })
        return obj
      })
      this.uploadLoading = true
      uploadUserData(uploadData).then(res => {
        this.uploadLoading = false
        if (res.msg === 'success') {
          this.$message.success('操作成功！')
          this.$emit('upload-success')
          this.$refs.uploadDialog.handleRemove() // 上传成功清空当前文件列表
        } else {
          this.$message.error('操作失败！')
        }
      }).catch(() => {
        this.uploadLoading = false
      })
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep {
  .el-upload--text{
    width: 100%;
    .el-upload-dragger{
      width: 100%;
    }
  }
  .el-dialog .el-dialog__body{
    padding: 0 20px;
    p{
      color: #BCBCBC;
    }
  }
  .text-button{
    padding: 0 0;
  }
}
</style>
