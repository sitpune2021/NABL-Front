import { Fields } from '@/@types/unit'
import ApiService from './ApiService'

export async function apiGetUnitList<T, U extends Record<string, unknown>>(
    params: U,
) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/unit',
        method: 'get',
        params,
    })
}

export async function apiUnit(data: Fields) {
    return ApiService.fetchDataWithAxios<Fields>({
        url: '/unit',
        method: 'post',
        data,
    })
}

export async function apiGetUnitById(id: string) {
    return ApiService.fetchDataWithAxios<Fields>({
        url: `/unit/${id}`,
        method: 'get',
    })
}

export async function apiUpdateUnit(id: string, data: Fields) {
    return ApiService.fetchDataWithAxios<Fields>({
        url: `/unit/${id}`,
        method: 'put',
        data,
    })
}
