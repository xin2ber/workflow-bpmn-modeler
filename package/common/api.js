import request from './request'

/**
 * 类别列表
 */
export function getCategoryList() {
  return request({
    url: '/flow/category/list',
    method: 'get'
  })
}

/**
 * 候选人类型列表
 */
export function getCandidatesTypeList() {
  return request({
    url: '/flow/model/candidatesTypeList',
    method: 'get'
  })
}
