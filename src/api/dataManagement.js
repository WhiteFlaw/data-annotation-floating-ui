/*
 * @Author: M.Ming
 * @Date: 2023-03-28 14:54:19
 * @LastEditTime: 2023-04-23 08:38:41
 * @FilePath: \3d-data-admin\src\api\dataManagement.js
 * @Description: 数据导入功能接口封装
 */

const { POST, GET } = require('@/utils/http-client')
/**
 * 获取需要导入的数据文件夹列表
 * @param {number} [projectStatus=0]
 * @return {*}
 */
const getProjectDataList = (projectStatus = 0) => {
  return GET('/admin/project/list', { projectStatus })
}
/**
 * 确认导入数据
 * @param {number} [chunkSize=0] 分包大小
 * @param {string} [customerId=''] 客户Id
 * @param {string} [customerName=''] 客户名称
 * @param {string} [endDate=''] 结束日期
 * @param {string} [projectFolderName=''] 项目数据文件夹名称
 * @param {string} [projectName=''] 项目名称
 * @param {string} [startDate=''] 起始日期
 * @param {*} [teamIds=[]] 团队id，多选
 * @param {string} [description=''] 项目描述
 * @return {*}
 */
const confirmInitData = ({
  chunkSize = 0,
  customerId = 0,
  customerName = '',
  endDate = '',
  projectFolderName = '',
  projectName = '',
  startDate = '',
  teamIds = [],
  description = '',
  type = 0,
  managerId = 0,
  managerNickname = ''
}) => {
  return POST('/admin/project/inc', {
    chunkSize,
    customerId,
    customerName,
    endDate,
    projectFolderName,
    projectName,
    startDate,
    teamIds,
    description,
    type,
    managerId,
    managerNickname
  })
}

export { getProjectDataList, confirmInitData }
