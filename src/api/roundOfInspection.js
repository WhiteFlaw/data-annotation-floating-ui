/**
 * Gu Xunqin
 * 2023-04-17
 * 我的任务-一轮质检
 */

import {GET, POST, PUT} from '@/utils/http-client'

/**
 * 查询项目列表
 * @param data 项目名称 项目状态 项目类型
 * @returns {*}
 */
export function queryItemDataList(data) {
  return POST(`/admin/qc/getQcProjectPage`, data)
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
  return POST(`/admin/qc/getQcTaskPage`, data)
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
 * 领取质检任务
 * @param taskId 任务id
 * @param checkType 一检二检区分
 * @returns {*}
 */
export function receiveQualityInspectionTask(taskId, checkType) {
  return PUT(`/admin/qc/getQcTask/${taskId}`, {}, { checkType })
}

/**
 * 模拟一检完成
 * @param taskId 任务id
 * @param checkType 一检二检区分
 * @returns {*}
 */
export function updateCompletionOfFirstInspection(taskId, checkType) {
  return PUT(`/admin/qc/done-qc-task/${taskId}`, {}, {checkType})
}

/**
 * 驳回任务
 * @param taskId 任务id
 * @param checkType 一检二检区分
 * @returns {*}
 */
export function rejectTheTask(taskId, checkType) {
  return PUT(`/admin/qc/reject-qc/${taskId}`, {}, {checkType})
}

/**
 * 批量驳回至标注
 * @param data ID 任务名称 项目ID 项目名称 标注用户ID 	标注用户昵称 任务状态 创建时间
 * @returns {*}
 */
export function batchRejectTag(data) {
  return PUT(`/admin/qc/reject-tag`, data)
}
