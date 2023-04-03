/**
 * Gu Xunqin
 * 2023-03-28
 * 团队管理-团队列表
 */
import {DELETE, GET, POST, PUT} from '@/utils/http-client'

/**
 * 查询团队列表信息
 * @param name 姓名
 * @param pageIndex 页码
 * @param pageSize 每页条数
 * @returns {*}
 */
export function queryTeamListData({name, pageIndex, pageSize}) {
  return GET(`/admin/team/getTeamPage`, {name, pageIndex, pageSize})
}

/**
 * 查询团队下角色列表
 * @param roleId 角色
 * @param teamId 团队id
 * @param pageIndex 页码
 * @param pageSize 每页条数
 * @returns {*}
 */
export function queryTeamRolesData({roleId, teamId, pageIndex, pageSize}) {
  return GET(`/admin/team/getTeamRoles`, {roleId, teamId, pageIndex, pageSize})
}

/**
 * 新增/修改团队
 * @param data 创建时间 团队描述 id 团队名称 创建人id 创建人名称
 * @returns {*}
 */
export function addOrUpdateTeam(data) {
  return PUT(`/admin/team/saveOrUpdateTeam`, data)
}

/**
 * 删除团队
 * @param data 创建时间 团队描述 id 团队名称 创建人ID 创建人名称
 * @returns {*}
 */
export function deleteTeamData(data) {
  return DELETE(`/admin/team/removeTeam`, data)
}

/**
 * 查询暂未分配的用户
 * @param teamId
 * @returns {*}
 */
export function queryUserData({ teamId }) {
  return GET(`/admin/team/getNotAssignedUser`, {teamId})
}

/**
 * 新增或者修改团队下的角色
 * @param data 创建时间 id 角色ID 团队ID 用户ID
 * @returns {*}
 */
export function addOrUpdateUserData(data) {
  return POST(`/admin/team/updateTeamRoles`, data)
}

/**
 * 查询用户详细信息
 * @param teamId 团队id
 * @param userId 用户id
 * @returns {*}
 */
export function queryDetailedInformation({teamId, userId}) {
  return GET(`/admin/team/getUserInfoForTeam`, {teamId, userId})
}

/**
 * 查询团队信息
 * @param teamId 团队id
 * @returns {*}
 */
export function queryTeamDetail({teamId}) {
  return GET(`/admin/team/getTeam`, {teamId})
}
