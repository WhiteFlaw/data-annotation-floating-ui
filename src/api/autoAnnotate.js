import { GET } from '@/utils/http-client'

/**
  * 自动标注
  * @param scene 当前scene
  * @param frame 当前帧
  * @returns { AxiosPromise }
  */
export function AutoAnnotate(params) {
  return GET(`/auto_annotate?scene=${params.scene}&frame=${params.frame}`)
}
