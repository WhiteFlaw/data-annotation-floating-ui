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
 * @param userId
 * @returns {*}
 */
export function queryUserRole(userId) {
  return GET(`/admin/userManagement/getUserRoles`, {userId})
}
