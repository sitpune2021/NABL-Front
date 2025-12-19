import { Fields, GetLocationDetailResponse } from '@/@types/location'
import ApiService from './ApiService'

export async function apiGetLocationList<T, U extends Record<string, unknown>>(
    params: U,
) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/location',
        method: 'get',
        params,
    })
}

export async function apiLocation(data: Fields) {
    return ApiService.fetchDataWithAxios<Fields>({
        url: '/location',
        method: 'post',
        data,
    })
}

export async function apiGetLocationById(id: string) {
    return ApiService.fetchDataWithAxios<GetLocationDetailResponse>({
        url: `/location/${id}`,
        method: 'get',
    })
}

export async function apiUpdateLocation(id: string, data: Fields) {
    return ApiService.fetchDataWithAxios<Fields>({
        url: `/location/${id}`,
        method: 'put',
        data,
    })
}
