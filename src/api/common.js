/*
 * @Author: M.Ming
 * @Date: 2023-03-31 11:29:41
 * @LastEditTime: 2023-05-25 11:37:50
 * @FilePath: \3d-data-admin\src\api\common.js
 * @Description: 通用（下拉列表等）接口API
 */
const { GET, POST } = require('@/utils/http-client')

/**
 * 获取所有客户列表
 * @return {*}
 */
const getAllCustomersList = () => {
  return GET('/admin/customer/list')
}
/**
 * 获取所有团队列表
 * @return {*}
 */
const getAllTeamsList = () => {
  return GET('/admin/team/getTeamList')
}
/**
 * 获取所有客户下拉列表，仅返回id和name
 * @return {*}
 */
const getCustomersOptions = () => {
  return GET('/admin/common/customerList')
}
/**
 * 获取所有角色下拉列表，仅返回id和name
 * @return {*}
 */
const getRoleOptions = () => {
  return GET('/admin/common/getRoleList')
}
/**
 * 获取所有项目经理下拉列表，仅返回id和nickname
 * @param type 是否仅查询有效
 * @returns {*}
 */
const getProjectManagerOptions = (type) => {
  return GET(`/admin/common/managerList/${type}`)
}
/**
 * 获取所有团队下拉列表，仅返回id和name
 * @return {*}
 */
const getGroupOptions = () => {
  return GET('/admin/common/teamList')
}
/**
 * 获取所有团队leader列表
 * @return {*}
 */
const getTeamLeaderOptions = () => {
  return GET('/admin/common/teamLeaderList')
}
const getAcceptanceOfficerList = () => {
  return GET('/admin/common/list-at')
}
/**
 * 返回项目状态下拉列表
 * 项目状态(0:未领取;1:进行中;2:验收中;3:已完成;)
 * @return {*}
 */
const projectStatusOptions = [
  { id: 0, name: '未领取' },
  { id: 1, name: '进行中' },
  { id: 2, name: '验收中' },
  { id: 3, name: '已完成' }
]
/**
 * 返回项目类型下拉列表
 * 项目类型(0:未设定;1:2D;2:3D;)
 * @return {*}
 */
const projectTypeOptions = [
  { id: 1, name: '2D' },
  { id: 2, name: '3D' }
]

const getJobStatusChartData = ({ dateTime = '', projectId = 0, type, userId = 0 }) => {
  return POST('/admin/log-view/work-record', { dateTime, projectId, type, userId })
}

export {
  getAllCustomersList,
  getAllTeamsList,
  getCustomersOptions,
  getRoleOptions,
  getProjectManagerOptions,
  getGroupOptions,
  getTeamLeaderOptions,
  projectStatusOptions,
  projectTypeOptions,
  getAcceptanceOfficerList,
  getJobStatusChartData
}
