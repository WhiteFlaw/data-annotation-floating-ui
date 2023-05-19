/**
 * 杨鹏飞
 * 2023-04-20
 * 验收模块
 */

import {GET, POST} from '@/utils/http-client'

/**
 * 查询项目列表
 * @param data 项目名称 项目状态 项目类型
 * @returns {*}
 */
export function queryItemDataList(data) {
  return POST(`/admin/accept/getAcceptProjectPage`, data)
}

/**
 * 查询项目详情
 * @param id
 * @returns {*}
 */
export function queryProjectDetails(id) {
  return GET(`/admin/project/info/${id}`)
}

/**
 * 查询任务列表
 * @param data 一检1/二检2 查询页码 每页条数 项目ID 状态集合 标注员ID
 * @returns {*}
 */
export function queryTaskList(data) {
  return POST(`/admin/accept/getAcceptTaskPage`, data)
}

/**
 * 根据项目id查询团队成员
 * @param projectId 项目id
 * @returns {*}
 */
export function getTeamUserList(projectId) {
  return GET(`/admin/common/listTagUser/${projectId}`)
}

/**
 * 一键验收功能
 * @param data 项目ID(项目整个驳回传这个) 	作业ID(作业单张驳回传这个) 驳回原因 验收通过0/验收驳回1
 * @returns {*}
 */
export function checkProject(data) {
  return POST(`/admin/accept/`, data)
}

/**
 * 获取验收随机数据
 * @param data 页码 每页条数 百分比 项目id
 * @returns {*}
 */
export function getRandomDataList(data) {
  return POST(`/admin/accept/batch-reject`, data)
}
