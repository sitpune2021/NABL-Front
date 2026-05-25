/* eslint-disable @typescript-eslint/no-explicit-any */
import ApiService from './ApiService'
import apiEndpointConfig from '@/configs/api-endpoint.config'

export async function apiGetPrefixList() {
    return ApiService.fetchDataWithAxios({
        url: apiEndpointConfig.prefixConfig,
        method: 'get',
    })
}

export async function apiCreatePrefix(data: any) {
    return ApiService.fetchDataWithAxios({
        url: apiEndpointConfig.prefixConfig,
        method: 'post',
        data,
    })
}

export async function apiGetPrefixById(id: string) {
    return ApiService.fetchDataWithAxios({
        url: `${apiEndpointConfig.prefixConfig}/${id}`,
        method: 'get',
    })
}

export async function apiUpdatePrefix(id: number, data: any) {
    return ApiService.fetchDataWithAxios({
        url: `${apiEndpointConfig.prefixConfig}/${id}`,
        method: 'put',
        data,
    })
}
export async function apiGetPrefixMasters() {
    return ApiService.fetchDataWithAxios({
        url: '/prefix-config/masters/list',
        method: 'get',
    })
}
