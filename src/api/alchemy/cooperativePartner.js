import request from '@/utils/request'

// 创建合作伙伴
export function createCooperativePartner(data) {
  return request({
    url: '/alchemy/cooperative-partner/create',
    method: 'post',
    data: data
  })
}

// 更新合作伙伴
export function updateCooperativePartner(data) {
  return request({
    url: '/alchemy/cooperative-partner/update',
    method: 'put',
    data: data
  })
}

// 删除合作伙伴
export function deleteCooperativePartner(id) {
  return request({
    url: '/alchemy/cooperative-partner/delete?id=' + id,
    method: 'delete'
  })
}

// 获得合作伙伴
export function getCooperativePartner(id) {
  return request({
    url: '/alchemy/cooperative-partner/get?id=' + id,
    method: 'get'
  })
}

// 获得合作伙伴分页
export function getCooperativePartnerPage(query) {
  return request({
    url: '/alchemy/cooperative-partner/page',
    method: 'get',
    params: query
  })
}

// 导出合作伙伴 Excel
export function exportCooperativePartnerExcel(query) {
  return request({
    url: '/alchemy/cooperative-partner/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}
