import { POST, GET } from '@/utils/http-client'

/**
  * 登录
  * @param points
  * @returns { AxiosPromise }
  */
export function login(data) {
  return POST(`/admin/auth/login`, data)
}

/**
  * ???
  * @param script
  * @returns { AxiosPromise }
  */
export function getInfo(token) {
  return GET(`/web/user/info`, { token })
}

