import { POST } from '@/utils/http-client'

/**
  * 重加载世界
  * @param list scene & frame list
  * @returns { AxiosPromise }
  */
export function ReloadWorldList(data) {
  return POST(`/loadworldlist`, data)
}

/**
  * 保存世界
  * @param ann worldinfo list
  * @returns { AxiosPromise }
  */
export function SaveWorldList(data) {
  return POST(`/saveworldlist`, data)
}
