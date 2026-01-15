import { GetLabDetailResponse, Lab } from '@/@types/lab'
import ApiService from './ApiService'
import apiEndpointConfig from '@/configs/api-endpoint.config'

export async function apiGetLabList<T, U extends Record<string, unknown>>(
    params: U,
) {
    return ApiService.fetchDataWithAxios<T>({
        url: apiEndpointConfig.labs,
        method: 'get',
        params,
    })
}

export async function apiLab(data: Lab) {
    return ApiService.fetchDataWithAxios<Lab>({
        url: apiEndpointConfig.labs,
        method: 'post',
        data,
    })
}

export async function apiGetLabById(id: string) {
    return ApiService.fetchDataWithAxios<GetLabDetailResponse>({
        url: `${apiEndpointConfig.labs}/${id}`,
        method: 'get',
    })
}

export async function apiUpdateLab(id: string, data: Lab) {
    return ApiService.fetchDataWithAxios<Lab>({
        url: `${apiEndpointConfig.labs}/${id}`,
        method: 'put',
        data,
    })
}

export async function apiGetClauseDocumentsList(standardId: number | string) {
    return ApiService.fetchDataWithAxios({
        url: `/standards-current`,
        method: 'get',
        params: {
            standard_id: standardId,
        },
    })
}
