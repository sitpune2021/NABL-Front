import { Fields, GetTemplateDetailResponse } from '@/@types/template'
import ApiService from './ApiService'
import apiEndpointConfig from '@/configs/api-endpoint.config'

export async function apiGetTemplateList<T, U extends Record<string, unknown>>(
    params: U,
) {
    return ApiService.fetchDataWithAxios<T>({
        url: apiEndpointConfig.templates,
        method: 'get',
        params,
    })
}

export async function apiTemplate(data: Fields) {
    return ApiService.fetchDataWithAxios<Fields>({
        url: apiEndpointConfig.templates,
        method: 'post',
        data,
    })
}

export async function apiGetTemplateById(id: string) {
    return ApiService.fetchDataWithAxios<GetTemplateDetailResponse>({
        url: `${apiEndpointConfig.templates}/${id}`,
        method: 'get',
    })
}

export async function apiGetTemplateVersionsById<
    T,
    U extends Record<string, unknown>,
>(id: string, params: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: `${apiEndpointConfig.templatesVerions}/${id}`,
        method: 'get',
        params,
    })
}

export async function apiUpdateTemplate(id: string, data: Fields) {
    return ApiService.fetchDataWithAxios<Fields>({
        url: `${apiEndpointConfig.templates}/${id}`,
        method: 'put',
        data,
    })
}
