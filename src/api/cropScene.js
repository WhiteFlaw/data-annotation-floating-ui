import { POST } from '@/utils/http-client'

/**
  * Generate点击事件
  * @param rawSceneId scene
  * @param desc scene-desc
  * @param startTime scene-start-time
  * @param seconds scene-seconds
  * @returns { AxiosPromise }
  */
export function Generate(data) {
  return POST('/cropscene', data)
}
