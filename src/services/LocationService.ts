import { Fields, GetLocationDetailResponse } from '@/@types/location'
import ApiService from './ApiService'
import { PrefixFormSchema } from '@/@types/common'

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
    console.log('Updating location with ID:', id, 'and data:', data) // Debug log;

    return ApiService.fetchDataWithAxios<Fields>({
        url: `/location/${id}`,
        method: 'put',
        data,
    })
}

export async function fetchPrefixLocationList<T>() {
    return ApiService.fetchDataWithAxios<T>({
        url: '/location-prefix',
        method: 'get',
    })
}

export async function createPrefixLocation(data: PrefixFormSchema) {
    return ApiService.fetchDataWithAxios<PrefixFormSchema>({
        url: '/location-prefix',
        method: 'post',
        data,
    })
}

export async function fetchPrefixLocationById(id: string) {
    return ApiService.fetchDataWithAxios<PrefixFormSchema>({
        url: `/location-prefix/${id}`,
        method: 'get',
    })
}

export async function updatePrefixLocation(id: string, data: PrefixFormSchema) {
    return ApiService.fetchDataWithAxios<PrefixFormSchema>({
        url: `/location-prefix/${id}`,
        method: 'put',
        data,
    })
}
