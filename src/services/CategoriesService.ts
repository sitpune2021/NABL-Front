import { Fields } from '@/@types/category'
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

export async function apiCategory(data: Fields) {
    return ApiService.fetchDataWithAxios<Fields>({
        url: '/category',
        method: 'post',
        data,
    })
}
