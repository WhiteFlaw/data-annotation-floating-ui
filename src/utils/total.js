import * as XLSX from 'xlsx'
/**
 * 输入框限制
 * @param val 输入值
 * @param limitLength 输入长度，无限制则为空
 * @param restrictedChinese 是否不允许输入中文，true 允许/false 不允许
 * @param limitingCharacter 是否限制字符
 * @returns {*}
 */
export function inputRestriction(val, limitLength, restrictedChinese, limitingCharacter) {
  let newVal = val
  if (limitLength) {
    if (newVal.length > Number(limitLength)) {
      newVal = newVal.slice(0, Number(limitLength))
    }
  }
  if (restrictedChinese) {
    newVal = newVal.replace(/[^\x00-\xff]/g, '')
  }
  if (limitingCharacter) {
    newVal = newVal.replace(/[^\w]/g, '')
  }
  return newVal
}

/**
 * @description 导出表格数据
 * @author Yu Yang
 * @date 2023-06-14
 * @param data 导出数据
 * @param fileName 导出文件名
 */
export function downloadExcelData(data, fileName) {
  const worksheet = XLSX.utils.aoa_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')
  XLSX.writeFile(workbook, fileName)
}

/**
 * @description 计算日期差 精确到秒
 * @author 杨鹏飞
 * @date 2023-06-14
 * @param startTime 开始时间
 * @param endTime 结束时间
 */
export function getDateDiff(startTime, endTime) {
  let diffStr = ''
  const data1 = new Date(startTime)
  const data2 = new Date(endTime)
  const diffTime = data2.getTime() - data1.getTime()
  const days = Math.floor(diffTime / (24 * 3600 * 1000))
  // 计算出小时数
  const leave1 = diffTime % (24 * 3600 * 1000) // 计算天数后剩余的毫秒数
  const hours = Math.floor(leave1 / (3600 * 1000))
  // 计算相差分钟数
  const leave2 = leave1 % (3600 * 1000) // 计算小时数后剩余的毫秒数
  const minutes = Math.floor(leave2 / (60 * 1000))
  // 计算相差秒数
  const leave3 = leave2 % (60 * 1000) // 计算分钟数后剩余的毫秒数
  const seconds = Math.round(leave3 / 1000)
  if (days !== 0) {
    diffStr = days + '天 '
  }
  if (days >= 1) {
    diffStr += days + '天'
  }
  if (hours >= 1) {
    diffStr += hours + '小时'
  }
  if (minutes > 0) {
    diffStr += minutes + '分钟'
  }
  if (seconds > 0) {
    diffStr += seconds + '秒'
  }
  return diffStr
}

/**
 * 当前日期
 * @returns {string}
 */
export function getLocalDate() {
  const dateTime = new Date()
  const year = dateTime.getFullYear()
  const month = ('0' + (dateTime.getMonth() + 1)).slice(-2)
  const day = ('0' + dateTime.getDate()).slice(-2)
  return year + '-' + month + '-' + day + ' 00:00:00'
}
