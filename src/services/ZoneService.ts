import { Fields, GetZoneDetailResponse } from '@/@types/zone'
import ApiService from './ApiService'
import apiEndpointConfig from '@/configs/api-endpoint.config'

export async function apiGetZoneList<T, U extends Record<string, unknown>>(
    params: U,
) {
    return ApiService.fetchDataWithAxios<T>({
        url: apiEndpointConfig.zones,
        method: 'get',
        params,
    })
}

export async function apiZone(data: Fields) {
    return ApiService.fetchDataWithAxios<GetZoneDetailResponse>({
        url: apiEndpointConfig.zones,
        method: 'post',
        data,
    })
}

export async function apiGetZoneById(id: string) {
    return ApiService.fetchDataWithAxios<GetZoneDetailResponse>({
        url: `${apiEndpointConfig.zones}/${id}`,
        method: 'get',
    })
}

export async function apiUpdateZone(id: string, data: Fields) {
    return ApiService.fetchDataWithAxios<GetZoneDetailResponse>({
        url: `${apiEndpointConfig.zones}/${id}`,
        method: 'put',
        data,
    })
}
