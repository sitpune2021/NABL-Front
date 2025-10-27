import { Fields } from '@/@types/standard'
import ApiService from './ApiService'

export async function apiGetStandardList<T, U extends Record<string, unknown>>(
    params: U,
) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/standard',
        method: 'get',
        params,
    })
}

export async function apiGetStandardDataList<T>() {
    return ApiService.fetchDataWithAxios<T>({
        url: '/standard-data',
        method: 'get',
    })
}

export async function apiCreateStandard(data: Fields) {
    return ApiService.fetchDataWithAxios<Fields>({
        url: '/standard',
        method: 'post',
        data,
    })
}

export async function apiGetStandardById(id: string) {
    return ApiService.fetchDataWithAxios<Fields>({
        url: `/standard/${id}`,
        method: 'get',
    })
}

export async function apiUpdateStandard(id: string, data: Fields) {
    return ApiService.fetchDataWithAxios<Fields>({
        url: `/standard/${id}`,
        method: 'put',
        data,
    })
}
