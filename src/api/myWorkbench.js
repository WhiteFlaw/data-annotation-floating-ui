/**
 * Gu Xunqin
 * 2023-04-25
 * 我的工作台
 */
import {POST} from '@/utils/http-client'

/**
 * 查询项目列表
 * @param data 查询页码 当前页条数 项目名称 状态 项目类型
 * @returns {*}
 */
export function queryItemList(data) {
  return POST(`admin/user/getWorkbenchProjectPage`, data)
}
/**
 * 查询项目下团队列表
 * @param data 查询页码 当前页条数 项目id
 * @returns {*}
 */
export function queryTeamList(data) {
  return POST(`/admin/user/getWorkbenchTeamPage`, data)
}
/**
 * 查询项目下团队内成员
 * @param data 查询页码 当前页条数 项目id 团队id
 * @returns {*}
 */
export function queryMemberList(data) {
  return POST(`/admin/user/pageTeamUserWorkCase`, data)
}

/**
 * 查询项目下团队信息
 * @param projectId 项目id
 * @returns {*}
 */
export function queryItemTeamList(projectId) {
  return POST(`/admin/user/listTeamCase/${projectId}`)
}

/**
 * 查看项目内任务状态
 * @param data
 * @returns {*}
 */
export function queryTaskStatus(data) {
  return POST(`/admin/user/pageTeamTaskWorkCase`, data)
}
