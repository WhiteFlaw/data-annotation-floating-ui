/*
 * @Author: M.Ming
 * @Date: 2023-03-28 17:14:28
 * @LastEditTime: 2023-03-29 16:45:24
 * @FilePath: \3d-data-admin\src\api\projectManagement.js
 * @Description: 项目管理功能接口API
 */
const { POST, GET, PUT, DELETE } = require('@/utils/http-client')

const getProjectsList = () => {
  return GET('')
}

const updateProjectsList = () => {
  return PUT('')
}

const deleteProjectsList = () => {
  return DELETE('')
}

const releaseProjectData = () => {
  return POST('')
}

export { getProjectsList, updateProjectsList, deleteProjectsList, releaseProjectData }
