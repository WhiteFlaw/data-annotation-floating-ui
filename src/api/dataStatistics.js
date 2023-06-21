/**
 * Yu Yang
 * 2023/06/14
 * 数据统计
 */

import { POST } from '@/utils/http-client'
import { GET } from '@/utils/http-client'
/**
 * 查询项目经理数据统计列表
 * @param data 项目名称，团队名称，开始时间，结束时间
 * @returns {*}
 */
export function searchManagerStatisticsDataList(data) {
  return POST(`/admin/statistics/manager`, data)
}

/**
 * 查询标注员数据统计列表
 * @param data 项目名称，任务名称，开始时间，结束时间
 * @returns {*}
 */
export function searchTaggerStatisticsDataList(data) {
  return POST(`/admin/statistics/tagger`, data)
}

/**
 * 查询质检员数据统计列表
 * @param data 标注员名称，任务名称，作业名称，开始时间，结束时间
 * @returns {AxiosPromise}
 */
export function searchQualityInspectionStatisticsDataList(data) {
  return POST('/admin/statistics/qc', data)
}

/**
 * 获取团队管理员下的团队集合
 * @returns {*}
 */
export function searchTeamLeaderDataList() {
  return GET(`/admin/statistics/teamLeader`)
}
/**
 * 获取团队管理员统计页面
 * @param data 查询页码，当前页条数，项目名称，结束查询时间，开始查询时间，标注员姓名，团队ID
 * @returns {*}
 */
export function searchTeamLeaderStatisticsDataList(data) {
  return POST(`/admin/statistics/teamLeader`, data)
}

/**
 * 团队管理员统计页面详情
 * @param data 查询页码，当前页条数，项目ID，标注员ID
 * @returns {*}
 */
export function searchTeamLeaderStatisticsTeamTaggerInfo(data) {
  return POST(`/admin/statistics/team-tagger-info`, data)
}

/**
 * 质检员统计页面
 * @param data 查询页码，当前页条数，0一检/1二检，结束查询时间 作业名称 团队管理时可传项目名 开始查询时间 任务名称 0质检统计/1团队管理员统计 质检统计时传标注员姓名/团队统计时传质检员姓名
 * @returns {*}
 */
export function teamLeaderStatisticsQc(data) {
  return POST(`/admin/statistics/qc`, data)
}
