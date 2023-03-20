import { GET } from '@/utils/http-client'

/**
  * 请求标注信息
  * @param scene 当前scene
  * @param frame 当前帧
  * @returns { AxiosPromise }
  */
export function LoadAnnotation(params) { // params
  return GET(`/load_annotation?scene=${params.scene}&frame=${params.frame}`)
}
