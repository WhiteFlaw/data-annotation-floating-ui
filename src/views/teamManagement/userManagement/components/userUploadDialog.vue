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
        'nickname': '姓名',
        'email': '邮箱',
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
        obj.age = this.changeAge(obj.age)
        obj.gender = this.changeGender(obj.gender)
        obj.education = this.changeEducation(obj.education)
        obj.socialSeniority = this.changeSocialSeniority(obj.socialSeniority)
        obj.labelProExp = this.changeLabelProExp(obj.labelProExp)
        obj.englishLevel = this.changeEnglishLevel(obj.englishLevel)
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
    },
    changeGender(val) { // 判断性别
      let gender
      switch (val) {
        case '男' : gender = 1
          break
        case '女' : gender = 2
          break
        default:gender = 0
          break
      }
      return gender
    },
    changeAge(val) { // 判断年龄
      let age
      switch (val) {
        case '20岁及以下' : age = 1
          break
        case '21-25岁' : age = 2
          break
        case '26-30岁' : age = 3
          break
        case '31-35岁' : age = 4
          break
        case '36岁及以上' : age = 5
          break
        default:age = 0
          break
      }
      return age
    },
    changeEducation(val) { // 判断学历
      let education
      switch (val) {
        case '中专' : education = 1
          break
        case '大专' : education = 2
          break
        case '本科' : education = 3
          break
        case '硕士' : education = 4
          break
        case '博士' : education = 5
          break
        default:education = 0
          break
      }
      return education
    },
    changeSocialSeniority(val) { // 判断社会工龄
      let socialSeniority
      switch (val) {
        case '0-5年' : socialSeniority = 1
          break
        case '6-10年' : socialSeniority = 2
          break
        case '10年以上' : socialSeniority = 3
          break
        default:socialSeniority = 0
          break
      }
      return socialSeniority
    },
    changeLabelProExp(val) { // 判断标注项目经验
      let labelProExp
      switch (val) {
        case '文本类标注经验' : labelProExp = 1
          break
        case '图片类标注经验' : labelProExp = 2
          break
        case '视频类标注经验' : labelProExp = 3
          break
        case '音频类标注经验' : labelProExp = 4
          break
        default:labelProExp = 0
          break
      }
      return labelProExp
    },
    changeEnglishLevel(val) { // 判断英语水平
      let englishLevel
      switch (val) {
        case 'CET-4' : englishLevel = 1
          break
        case 'CET-6' : englishLevel = 2
          break
        case '专4' : englishLevel = 3
          break
        case '专8' : englishLevel = 4
          break
        case '托福' : englishLevel = 5
          break
        case '雅思' : englishLevel = 6
          break
        default:englishLevel = 0
          break
      }
      return englishLevel
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
