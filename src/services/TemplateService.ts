import { Fields, GetTemplateDetailResponse } from '@/@types/template'
import ApiService from './ApiService'

export async function apiGetTemplateList<T, U extends Record<string, unknown>>(
    params: U,
) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/template',
        method: 'get',
        params,
    })
}

export async function apiTemplate(data: Fields) {
    return ApiService.fetchDataWithAxios<Fields>({
        url: '/template',
        method: 'post',
        data,
    })
}

export async function apiGetTemplateById(id: string) {
    return ApiService.fetchDataWithAxios<GetTemplateDetailResponse>({
        url: `/template/${id}`,
        method: 'get',
    })
}

export async function apiUpdateTemplate(id: string, data: Fields) {
    return ApiService.fetchDataWithAxios<Fields>({
        url: `/template/${id}`,
        method: 'put',
        data,
    })
}
