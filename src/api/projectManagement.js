/*
 * @Author: M.Ming
 * @Date: 2023-03-28 17:14:28
 * @LastEditTime: 2023-04-23 11:08:20
 * @FilePath: \3d-data-admin\src\api\projectManagement.js
 * @Description: 项目管理功能接口API
 */
const { POST, GET, PUT, DELETE } = require('@/utils/http-client')
/**
 * 获取项目列表
 * @param {*} {
 *   customerId = 0, 客户ID
 *   managerId = 0, 项目经理ID
 *   pageIndex = 0, 页码
 *   pageSize = 0, 每页条数
 *   projectName = '', 项目名称
 *   status = 0, 项目状态(0:未领取;1:进行中;2:验收中;3:已完成;)
 *   teamId = 0, 团队ID
 *   type = 0 项目类型(0:未设定;1:2D;2:3D;)
 * }
 * @return {*}
 */
const getProjectsList = ({ customerId = 0, managerId = 0, pageIndex = 0, pageSize = 0, projectName = '', status = 0, teamId = 0, type = 0 }) => {
  return POST('/admin/project/page', { customerId, managerId, pageIndex, pageSize, projectName, status, teamId, type })
}
/**
 * 编辑项目
 * @param {*} {
 *   createdTime = '', 创建时间
 *   customerId = 0, 客户ID
 *   customerName = '', 客户名称
 *   description = '', 项目描述
 *   endDate = '', 项目结束时间
 *   fromPath = '', 项目原路径
 *   id = 0, 项目ID
 *   name = '', 项目名称
 *   originalFolder = '', 项目原文件夹名称
 *   startDate = '', 项目开始时间
 *   status = 0, 项目状态(0:未领取;1:进行中;2:验收中;3:已完成;)
 *   taskCount = 0, 任务总数
 *   toPath = '', 生成项目路径
 *   type = 0, 项目类型(0:未设定;1:2D;2:3D;)
 *   userId = 0, 创建超管ID
 *   userNickname = '', 创建超管名称
 *   workCount = 0 作业总数
 * }
 * @return {*}
 */
const updateProjectsList = ({
  createdTime = '',
  customerId = 0,
  customerName = '',
  description = '',
  endDate = '',
  fromPath = '',
  id = 0,
  name = '',
  originalFolder = '',
  startDate = '',
  status = 0,
  taskCount = 0,
  toPath = '',
  type = 0,
  userId = 0,
  userNickname = '',
  workCount = 0
}) => {
  return PUT('/admin/project/', {
    createdTime,
    customerId,
    customerName,
    description,
    endDate,
    fromPath,
    id,
    name,
    originalFolder,
    startDate,
    status,
    taskCount,
    toPath,
    type,
    userId,
    userNickname,
    workCount
  })
}
/**
 * 删除项目
 * @param {*} id 项目ID
 * @return {*}
 */
const deleteProjectsList = (id) => {
  return DELETE(`/admin/project/${id}`)
}
/**
 * 释放项目
 * @param {*} id 项目ID
 * @return {*}
 */
const releaseProjectData = (id) => {
  return POST(`/admin/project/release/${id}`)
}
/**
 * 获取项目详情
 * @param {*} id
 * @return {*}
 */
const getProjectDetail = (id) => {
  return GET(`/admin/project/info/${id}`)
}
/**
 * 获取项目子任务详情
 * @param {*} {
 *    pageIndex = 0, 页码
 *    pageSize = 0, 每页条目
 *    projectId = 0 项目ID
 * }
 * @return {*}
 */
const getProjectChildTaskDetail = ({ pageIndex = 0, pageSize = 0, projectId = 0 }) => {
  return POST('/admin/project/tasks', { pageIndex, pageSize, projectId })
}
/**
 * 获取项目团队成员详情
 * @param {*} {
 *    pageIndex = 0, 页码
 *    pageSize = 0, 每页条目
 *    projectId = 0 项目ID
 * }
 * @return {*}
 */
const getProjectGroupDetail = ({ pageIndex = 0, pageSize = 0, projectId = 0 }) => {
  return POST('/admin/project/team-users', { pageIndex, pageSize, projectId })
}
/**
 * 为项目分配团队
 * @param {*} { projectId = 0, teamIds = [] }
 * @return {*}
 */
const assignToGroup = ({ projectId = 0, teamIds = [] }) => {
  return POST('/admin/project/dis-teams', { projectId, teamIds })
}

export {
  getProjectsList,
  updateProjectsList,
  deleteProjectsList,
  releaseProjectData,
  getProjectDetail,
  getProjectChildTaskDetail,
  getProjectGroupDetail,
  assignToGroup
}
