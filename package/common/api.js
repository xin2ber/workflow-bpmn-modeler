import request from './request'

/**
 * 分类类别
 * @param {*} data
 * @author 小道仙
 * @date 2020年2月19日
 */
export function getCategoryList() {
  return request({
    url: '/flow/category/list',
    method: 'get',
  })
}

/**
 * 候选人类型列表
 * @author lx
 * @date 2021年3月19日
 */
export function getCandidatesTypeList() {
  return request({
    url: '/flow/model/candidatesTypeList',
    method: 'get'
  })
}
