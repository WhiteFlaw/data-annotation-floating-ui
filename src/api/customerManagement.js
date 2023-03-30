/*
 * @Author: M.Ming
 * @Date: 2023-03-28 17:14:11
 * @LastEditTime: 2023-03-29 11:54:20
 * @FilePath: \3d-data-admin\src\api\customerManagement.js
 * @Description: 客户管理功能接口API
 */
const { POST, GET, PUT, DELETE } = require('@/utils/http-client')

const getCustomersList = () => {
  return GET('/admin/customer/list')
}

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

const updateCustomer = () => {
  return PUT('')
}

const deleteCustomer = () => {
  return DELETE('')
}

export { getCustomersList, addOneCustomer, updateCustomer, deleteCustomer }
