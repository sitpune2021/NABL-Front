import { Fields, GetLocationDetailResponse } from '@/@types/location'
import ApiService from './ApiService'
import apiEndpointConfig from '@/configs/api-endpoint.config'

export async function apiGetLocationList<T, U extends Record<string, unknown>>(
    params: U,
) {
    return ApiService.fetchDataWithAxios<T>({
        url: apiEndpointConfig.locations,
        method: 'get',
        params,
    })
}

export async function apiLocation(data: Fields) {
    return ApiService.fetchDataWithAxios<Fields>({
        url: apiEndpointConfig.locations,
        method: 'post',
        data,
    })
}

export async function apiGetLocationById(id: string) {
    return ApiService.fetchDataWithAxios<GetLocationDetailResponse>({
        url: `${apiEndpointConfig.locations}/${id}`,
        method: 'get',
    })
}

export async function apiUpdateLocation(id: string, data: Fields) {
    return ApiService.fetchDataWithAxios<Fields>({
        url: `${apiEndpointConfig.locations}/${id}`,
        method: 'put',
        data,
    })
}
