import request from '@/utils/request'

// 创建案例分类
export function createExampleCategory(data) {
  return request({
    url: '/alchemy/example-category/create',
    method: 'post',
    data: data
  })
}

// 更新案例分类
export function updateExampleCategory(data) {
  return request({
    url: '/alchemy/example-category/update',
    method: 'put',
    data: data
  })
}

// 删除案例分类
export function deleteExampleCategory(id) {
  return request({
    url: '/alchemy/example-category/delete?id=' + id,
    method: 'delete'
  })
}

// 获得案例分类
export function getExampleCategory(id) {
  return request({
    url: '/alchemy/example-category/get?id=' + id,
    method: 'get'
  })
}

// 获得案例分类分页
export function getExampleCategoryPage(query) {
  return request({
    url: '/alchemy/example-category/page',
    method: 'get',
    params: query
  })
}

// 导出案例分类 Excel
export function exportExampleCategoryExcel(query) {
  return request({
    url: '/alchemy/example-category/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}
