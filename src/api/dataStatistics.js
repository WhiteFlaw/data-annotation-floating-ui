/**
 * Yu Yang
 * 2023/06/14
 * 数据统计
 */

import { POST } from '@/utils/http-client'

/**
 * 查询项目经理数据统计列表
 * @param data 项目名称，团队名称，开始时间，结束时间
 * @returns {*}
 */
export function searchManagerStatisticsDataList(data) {
  return POST(`/admin/statistics/manager`, data)
}

/**
 * 查询项目经理数据统计列表
 * @param data 项目名称，团队名称，开始时间，结束时间
 * @returns {*}
 */
export function searchTaggerStatisticsDataList(data) {
  return POST(`/admin/statistics/tagger`, data)
}
