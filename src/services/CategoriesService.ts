import { Fields, GetCategoryDetailResponse } from '@/@types/category'
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
    return ApiService.fetchDataWithAxios<GetCategoryDetailResponse>({
        url: '/category',
        method: 'post',
        data,
    })
}

export async function apiGetCategoryById(id: string) {
    return ApiService.fetchDataWithAxios<GetCategoryDetailResponse>({
        url: `/category/${id}`,
        method: 'get',
    })
}

export async function apiUpdateCategory(id: string, data: Fields) {
    return ApiService.fetchDataWithAxios<GetCategoryDetailResponse>({
        url: `/category/${id}`,
        method: 'put',
        data,
    })
}
