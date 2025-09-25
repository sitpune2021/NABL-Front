import { CategoryAdd } from '@/views/masters/category/CategoryList/types'
import ApiService from './ApiService'

export async function apiGetCategoryList<T, U extends Record<string, unknown>>(
    params: U,
) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/category',
        method: 'get',
        params,
    })
}

export async function apiCategory(data: CategoryAdd) {
    return ApiService.fetchDataWithAxios<CategoryAdd>({
        url: '/category',
        method: 'post',
        data,
    })
}
