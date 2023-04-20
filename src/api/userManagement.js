/**
 * Gu Xunqin
 * 2023-03-28
 * 团队管理-用户管理
 */
import {POST, PUT, DELETE, GET} from '@/utils/http-client'

/**
 * 查询用户列表信息
 * @param data 	邮箱 名称 页码 每页条数
 * @returns {*}
 */
export function queryUserListData(data) {
  return POST(`/admin/userManagement/getMemberList`, data)
}

/**
 * 修改用户信息
 * @param data 	性别 年龄 学历 社会工龄 标注工龄 标注项目经验 非标注项目经验 英语水平
 * @returns {*}
 */
export function updateUserData(data) {
  return PUT(`/admin/userManagement/update`, data)
}

/**
 * 修改用户信息
 * @param data 	性别 年龄 学历 社会工龄 标注工龄 标注项目经验 非标注项目经验 英语水平
 * @returns {*}
 */
export function uploadUserData(data) {
  return POST(`/admin/userManagement/upload`, data)
}
/**
 * 删除用户信息
 * @param data 	性别 年龄 学历 社会工龄 标注工龄 标注项目经验 非标注项目经验 英语水平
 * @returns {*}
 */
export function deleteUserData(data) {
  return DELETE(`/admin/userManagement/remove`, data)
}
/**
 * 配置用户角色信息
 * @param data 创建时间 ID 角色ID 团队ID 用户ID
 * @returns {*}
 */
export function configurationUserData(data) {
  return POST(`/admin/userManagement/saveOrUpdateRole`, data)
}
/**
 * 删除用户角色信息
 * @param data 创建时间 删除标识 ID 角色ID 团队ID 用户ID
 * @returns {*}
 */
export function deleteUserRoleData(data) {
  return DELETE(`/admin/userManagement/removeUserRole`, data)
}

/**
 * 查询角色列表
 * @returns {*}
 */
export function queryRoleList() {
  return GET(`/admin/common/getRoleList`)
}

/**
 * 根据用户id查询用户角色
 * @param userId 用户id
 * @param teamId 团队id
 * @returns {*}
 */
export function queryUserRole(userId, teamId) {
  return GET(`/admin/userManagement/getUserRoles/${userId}/${teamId}`)
}

/**
 * 获取可修改的权限
 * @param teamId 查询团队内的可修改的角色为团队ID，用户列表内可修改的角色为0
 * @returns {*}
 */
export function getUserRole(teamId) {
  return GET(`/admin/userManagement/exe-role/${teamId}`)
}

/**
 * 新增用户信息
 * @param data 年龄 学历 创建时间 邮件 英语水平 性别 ID 标注项目经验 标注工龄 账号 昵称 密码 社会工龄
 * @returns {*}
 */
export function addUserManagement(data) {
  return POST(`/admin/userManagement/`, data)
}

/**
 * 用户无效化
 * @param data 年龄 学历 创建时间 邮件 英语水平 性别 ID 标注项目经验 标注工龄 账号 昵称 密码 社会工龄 无效化标识
 * @returns {*}
 */
export function userInvalidation(data) {
  return PUT(`/admin/userManagement/nullification`, data)
}
