import { POST, GET } from '@/utils/http-client'

/**
  * ???
  * @param points
  * @returns { AxiosPromise }
  */
export function PredictRotation(data) {
  return POST(`/predict_rotation`, data)
}

/**
  * ???
  * @param script
  * @returns { AxiosPromise }
  */
export function ImportLaloScript(data) { // url需要传入, 但该接口未调用
  return GET(``, data)
}

/**
  * 加载模型
  * @param script
  * @returns { AxiosPromise }
  */
export function LoadModel(data) { // url需要传入, 但该接口未调用
  return GET(``, data)
}

/**
  * 加载数据
  * @param script
  * @returns { AxiosPromise }
  */
export function LoadData(data) { // url需要传入, 但该接口未调用
  return GET(``, data)
}
