import request from '@/utils/request'

// 创建案例
export function createExample(data) {
  return request({
    url: '/alchemy/example/create',
    method: 'post',
    data: data
  })
}

// 更新案例
export function updateExample(data) {
  return request({
    url: '/alchemy/example/update',
    method: 'put',
    data: data
  })
}

// 删除案例
export function deleteExample(id) {
  return request({
    url: '/alchemy/example/delete?id=' + id,
    method: 'delete'
  })
}

// 获得案例
export function getExample(id) {
  return request({
    url: '/alchemy/example/get?id=' + id,
    method: 'get'
  })
}

// 获得案例分页
export function getExamplePage(query) {
  return request({
    url: '/alchemy/example/page',
    method: 'get',
    params: query
  })
}

// 导出案例 Excel
export function exportExampleExcel(query) {
  return request({
    url: '/alchemy/example/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}
