import { GET } from '@/utils/http-client'
/**
  * ???
  * @param script
  * @returns { AxiosPromise }
  */
export function ImportLaloScript(data) { // url需要传入, 但该接口未调用
  return GET(``, data)
}
