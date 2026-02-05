/* eslint-disable @typescript-eslint/no-explicit-any */
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

export const apiGetTemplateVersionDetail = (
    templateId: string,
    versionId: string,
) =>
    ApiService.fetchDataWithAxios({
        url: `/templates/${templateId}/versions/${versionId}`,
        method: 'get',
    })

export async function apiChangeCurrentTemplateVersion(id: string, data: any) {
    return ApiService.fetchDataWithAxios<Fields>({
        url: `/templates/${id}/change-current-version`,
        method: 'put',
        data,
    })
}
export async function apiChangeTemplateStatus(data: {
    template_id: string | number
    status: 'published' | 'archived'
}) {
    return ApiService.fetchDataWithAxios({
        url: '/templates/change-status',
        method: 'post',
        data,
    })
}
