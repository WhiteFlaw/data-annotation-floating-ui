import { GET } from '@/utils/http-client'

/**
  * ???
  * @param scene scene
  * @param frame 帧
  * @returns { AxiosPromise }
  */
export function LoadEgoPose(params) {
  return GET(`/load_ego_pose?scene=${params.scene}&frame=${params.frame}`)
}
