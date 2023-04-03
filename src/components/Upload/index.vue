<!--
* @FileDescription: 上传组件
* @Author: Gu Xunqin
* @Date: 2023-03-28
-->
<template>
  <div>
    <slot name="header" />
    <el-upload
      ref="upload"
      class="upload-demo"
      drag
      action="https://jsonplaceholder.typicode.com/posts/"
      :http-request="httpRequest"
    >
      <i class="el-icon-upload" />
      <div class="el-upload__text">选择本地文件</div>
    </el-upload>
  </div>
</template>

<script>
import * as XLSX from 'xlsx'

export default {
  name: 'UploadDialog',
  methods: {
    httpRequest(e) { // 上传解析
      const file = e.file
      const fileReader = new FileReader()
      fileReader.onload = (ev) => {
        try {
          const result = ev.target.result
          const {SheetNames, Sheets} = XLSX.read(result, {type: 'array'})
          const workSheets = Sheets[SheetNames[0]]
          const sheetRows = XLSX.utils.sheet_to_json(workSheets)
          if (sheetRows.length) {
            const header = Object.keys(sheetRows[0])
            this.uploadDataObject = {
              'header': header,
              'result': sheetRows
            }
            this.$emit('upload-file', this.uploadDataObject)
          } else {
            this.handleRemove(e)
            this.$message.error('上传文件无数据，请重新选择文件！')
          }
        } catch (err) {
          console.log(err)
          return false
        }
      }
      fileReader.readAsArrayBuffer(file)
    },
    handleRemove(file) { // 文件内没有数据删除文件列表文件
      this.$refs.upload.handleRemove(file)
    }
  }
}
</script>

<style scoped>

</style>
