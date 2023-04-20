/*
 * @Author: guo hongwei
 * @Date: 2023-04-04
 * @Description: 我的任务-标注任务API
 */
import {GET, POST, PUT} from '@/utils/http-client'

/**
 * 项目列表查询接口
 * @param data 分页信息、项目名称、项目状态、项目类型
 * @returns {*}
 */
export function getProjectList(data) {
  return POST('/admin/tagging/getTaggingProjectPage', data)
}

/**
 * 任务列表查询接口
 * @param params 分页信息、状态、id
 * @returns {*}
 */
export function getMarkTableData(params) {
  return POST('/admin/tagging/getTaggingTaskPage', params)
}

/**
 * 作业列表查询接口
 * @param params 分页信息、id
 * @returns {*}
 */
export function getjobTableData(params) {
  return GET('/admin/tagging/getTaggingHomeworkPage', params)
}

/**
 * 开始标注接口
 * @param projecId
 * @returns {*}
 */
export function beginLabel(projectId) {
  return PUT(`/admin/tagging/startTagging/${projectId}`)
}

/**
 * 返修标注接口
 * @param params
 * @returns {*}
 */
export function repairMark(params) {
  return PUT('/admin/tagging/updateTaskStatus', {}, params)
}

/**
 * 项目详情
 * @param id
 * @returns {*}
 */
export function getProjectDetailInfo(id) {
  return GET(`/admin/project/info/${id}`)
}

/**
 * 获取单个任务信息
 * @param taskId
 * @returns {*}
 */
export function getJobDetailInfo(taskId) {
  return GET(`/admin/tagging/${taskId}`)
}

/**
 * 模拟完成任务接口
 * @param taskId
 * @returns {*}
 */
export function imitateDoneMark(taskId) {
  return PUT(`/admin/tagging/finish/${taskId}`)
}

