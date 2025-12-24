import { Fields, GetZoneDetailResponse } from '@/@types/zone'
import ApiService from './ApiService'

export async function apiGetZoneList<T, U extends Record<string, unknown>>(
    params: U,
) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/zone',
        method: 'get',
        params,
    })
}

export async function apiZone(data: Fields) {
    return ApiService.fetchDataWithAxios<GetZoneDetailResponse>({
        url: '/zone',
        method: 'post',
        data,
    })
}

export async function apiGetZoneById(id: string) {
    return ApiService.fetchDataWithAxios<GetZoneDetailResponse>({
        url: `/zone/${id}`,
        method: 'get',
    })
}

export async function apiUpdateZone(id: string, data: Fields) {
    return ApiService.fetchDataWithAxios<GetZoneDetailResponse>({
        url: `/zone/${id}`,
        method: 'put',
        data,
    })
}
