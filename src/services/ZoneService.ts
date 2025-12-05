import { Fields, GetZoneDetailResponse } from '@/@types/zone'
import ApiService from './ApiService'
import { PrefixFormSchema } from '@/@types/common'

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
    return ApiService.fetchDataWithAxios<Fields>({
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
    console.log('Updating zone with ID:', id, 'and data:', data) // Debug log;

    return ApiService.fetchDataWithAxios<Fields>({
        url: `/zone/${id}`,
        method: 'put',
        data,
    })
}

export async function fetchPrefixZoneList<T>() {
    return ApiService.fetchDataWithAxios<T>({
        url: '/zone-prefix',
        method: 'get',
    })
}

export async function createPrefixZone(data: PrefixFormSchema) {
    return ApiService.fetchDataWithAxios<PrefixFormSchema>({
        url: '/zone-prefix',
        method: 'post',
        data,
    })
}

export async function fetchPrefixZoneById(id: string) {
    return ApiService.fetchDataWithAxios<PrefixFormSchema>({
        url: `/zone-prefix/${id}`,
        method: 'get',
    })
}

export async function updatePrefixZone(id: string, data: PrefixFormSchema) {
    return ApiService.fetchDataWithAxios<PrefixFormSchema>({
        url: `/zone-prefix/${id}`,
        method: 'put',
        data,
    })
}
