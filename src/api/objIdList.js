import { GET } from '@/utils/http-client'

/**
  * ???
  * @param scene scene
  * @returns { AxiosPromise }
  */
export function LoadObjIdsOfScene(params) {
  return GET(`/objs_of_scene?scene=${params.scene}`)
}
