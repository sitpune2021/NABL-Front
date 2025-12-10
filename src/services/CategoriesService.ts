import { Fields, GetCategoryDetailResponse } from '@/@types/category'
import ApiService from './ApiService'
import { PrefixFormSchema } from '@/@types/common'

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

export async function apiGetCategoryById(id: string) {
    return ApiService.fetchDataWithAxios<GetCategoryDetailResponse>({
        url: `/category/${id}`,
        method: 'get',
    })
}

export async function apiUpdateCategory(id: string, data: Fields) {
    return ApiService.fetchDataWithAxios<Fields>({
        url: `/category/${id}`,
        method: 'put',
        data,
    })
}

export async function fetchPrefixCategoryList<T>() {
    return ApiService.fetchDataWithAxios<T>({
        url: '/category-prefix',
        method: 'get',
    })
}

export async function createPrefixCategory(data: PrefixFormSchema) {
    return ApiService.fetchDataWithAxios<PrefixFormSchema>({
        url: '/category-prefix',
        method: 'post',
        data,
    })
}

export async function fetchPrefixCategoryById(id: string) {
    return ApiService.fetchDataWithAxios<PrefixFormSchema>({
        url: `/category-prefix/${id}`,
        method: 'get',
    })
}

export async function updatePrefixCategory(id: string, data: PrefixFormSchema) {
    return ApiService.fetchDataWithAxios<PrefixFormSchema>({
        url: `/category-prefix/${id}`,
        method: 'put',
        data,
    })
}
