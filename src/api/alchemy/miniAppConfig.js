import request from '@/utils/request'

// 创建小程序配置
export function createMiniAppConfig(data) {
  return request({
    url: '/alchemy/mini-app-config/create',
    method: 'post',
    data: data
  })
}

// 更新小程序配置
export function updateMiniAppConfig(data) {
  return request({
    url: '/alchemy/mini-app-config/update',
    method: 'put',
    data: data
  })
}

// 删除小程序配置
export function deleteMiniAppConfig(id) {
  return request({
    url: '/alchemy/mini-app-config/delete?id=' + id,
    method: 'delete'
  })
}

// 获得小程序配置
export function getMiniAppConfig(id) {
  return request({
    url: '/alchemy/mini-app-config/get?id=' + id,
    method: 'get'
  })
}

// 获得小程序配置分页
export function getMiniAppConfigPage(query) {
  return request({
    url: '/alchemy/mini-app-config/page',
    method: 'get',
    params: query
  })
}

// 导出小程序配置 Excel
export function exportMiniAppConfigExcel(query) {
  return request({
    url: '/alchemy/mini-app-config/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}
