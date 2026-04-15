import { GetStandardResponse } from '@/@types/standard'
import ApiService from './ApiService'
import apiEndpointConfig from '@/configs/api-endpoint.config'
import { StandardFormSchema } from '@/schemas/standard.schema'

export async function apiGetStandardList<T, U extends Record<string, unknown>>(
    params: U,
) {
    return ApiService.fetchDataWithAxios<T>({
        url: apiEndpointConfig.standards,
        method: 'get',
        params,
    })
}

export async function apiCreateStandard(data: StandardFormSchema) {
    return ApiService.fetchDataWithAxios<StandardFormSchema>({
        url: apiEndpointConfig.standards,
        method: 'post',
        data,
    })
}

export async function apiGetStandardById(id: number) {
    return ApiService.fetchDataWithAxios<GetStandardResponse>({
        url: `${apiEndpointConfig.standards}/${id}`,
        method: 'get',
    })
}

export async function apiUpdateStandard(id: string, data: StandardFormSchema) {
    return ApiService.fetchDataWithAxios<StandardFormSchema>({
        url: `${apiEndpointConfig.standards}/${id}`,
        method: 'put',
        data,
    })
}
