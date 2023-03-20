import { GET } from '@/utils/http-client'

/**
  * 请求帧
  * @param sceneName scene
  * @returns { AxiosPromise }
  */
export function AutoAnnotate(params) {
  return GET(`/scenemeta?scene=${params.sceneName}`)
}
