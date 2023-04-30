import request from '@/utils/request'

// 创建分类
export function createCategory(data) {
  return request({
    url: '/alchemy/category/create',
    method: 'post',
    data: data
  })
}

// 更新分类
export function updateCategory(data) {
  return request({
    url: '/alchemy/category/update',
    method: 'put',
    data: data
  })
}

// 删除分类
export function deleteCategory(id) {
  return request({
    url: '/alchemy/category/delete?id=' + id,
    method: 'delete'
  })
}

// 获得分类
export function getCategory(id) {
  return request({
    url: '/alchemy/category/get?id=' + id,
    method: 'get'
  })
}

// 获得分类分页
export function getCategoryPage(query) {
  return request({
    url: '/alchemy/category/page',
    method: 'get',
    params: query
  })
}

export function allCategory(query) {
  return request({
    url: '/alchemy/category/all',
    method: 'get',
    params: query
  })
}

// 导出分类 Excel
export function exportCategoryExcel(query) {
  return request({
    url: '/alchemy/category/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}
