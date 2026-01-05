import { Fields, GetStandardResponse } from '@/@types/standard'
import ApiService from './ApiService'
import apiEndpointConfig from '@/configs/api-endpoint.config'

export async function apiGetStandardList<T, U extends Record<string, unknown>>(
    params: U,
) {
    return ApiService.fetchDataWithAxios<T>({
        url: apiEndpointConfig.standards,
        method: 'get',
        params,
    })
}

export async function apiCreateStandard(data: Fields) {
    return ApiService.fetchDataWithAxios<Fields>({
        url: apiEndpointConfig.standards,
        method: 'post',
        data,
    })
}

export async function apiGetStandardById(id: string) {
    return ApiService.fetchDataWithAxios<GetStandardResponse>({
        url: `${apiEndpointConfig.standards}/${id}`,
        method: 'get',
    })
}

export async function apiUpdateStandard(id: string, data: Fields) {
    return ApiService.fetchDataWithAxios<Fields>({
        url: `${apiEndpointConfig.standards}/${id}`,
        method: 'put',
        data,
    })
}
