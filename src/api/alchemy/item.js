import request from '@/utils/request'

// 创建元素
export function createItem(data) {
  return request({
    url: '/alchemy/item/create',
    method: 'post',
    data: data
  })
}

// 更新元素
export function updateItem(data) {
  return request({
    url: '/alchemy/item/update',
    method: 'put',
    data: data
  })
}

// 删除元素
export function deleteItem(id) {
  return request({
    url: '/alchemy/item/delete?id=' + id,
    method: 'delete'
  })
}

// 获得元素
export function getItem(id) {
  return request({
    url: '/alchemy/item/get?id=' + id,
    method: 'get'
  })
}

// 获得元素分页
export function getItemPage(query) {
  return request({
    url: '/alchemy/item/page',
    method: 'get',
    params: query
  })
}

// 导出元素 Excel
export function exportItemExcel(query) {
  return request({
    url: '/alchemy/item/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}
