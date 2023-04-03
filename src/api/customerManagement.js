/*
 * @Author: M.Ming
 * @Date: 2023-03-28 17:14:11
 * @LastEditTime: 2023-03-30 12:45:26
 * @FilePath: \3d-data-admin\src\api\customerManagement.js
 * @Description: 客户管理功能接口API
 */
const { POST, PUT, DELETE } = require('@/utils/http-client')

const getCustomersList = ({
  customerEmail = '',
  customerName = '',
  customerPhone = '',
  pageIndex = 0,
  pageSize = 0
}) => {
  return POST('/admin/customer/page', {
    customerEmail,
    customerName,
    customerPhone,
    pageIndex,
    pageSize
  })
}
/**
 * 新增客户
 * @param {*} {
 *   createdTime = '', 创建时间，不传
 *   deleted = 0, 删除标记，不传
 *   description = '', 客户描述
 *   email = '', 客户邮件
 *   id = 0, 客户ID，新增不传
 *   name = '', 客户名称
 *   phone = '' 客户电话
 * }
 * @return {*}
 */
const addOneCustomer = ({
  createdTime = '',
  deleted = 0,
  description = '',
  email = '',
  id = 0,
  name = '',
  phone = ''
}) => {
  return POST('/admin/customer/', {
    createdTime,
    deleted,
    description,
    email,
    id,
    name,
    phone
  })
}
/**
 * 修改客户信息
 * @param {*} {
 *   createdTime = '', 创建时间，不传
 *   description = '', 客户描述
 *   email = '', 客户邮件
 *   id = 0, 客户ID
 *   name = '', 客户名称
 *   phone = '' 客户电话
 * }
 * @return {*}
 */
const updateCustomer = ({
  createdTime = '',
  description = '',
  email = '',
  id = 0,
  name = '',
  phone = ''
}) => {
  return PUT('/admin/customer/', {
    createdTime,
    description,
    email,
    id,
    name,
    phone
  })
}
/**
 * 删除客户
 * @param {*} id 客户ID
 * @return {*}
 */
const deleteCustomer = (id) => {
  return DELETE('/admin/customer/', {}, { id })
}

export { getCustomersList, addOneCustomer, updateCustomer, deleteCustomer }
