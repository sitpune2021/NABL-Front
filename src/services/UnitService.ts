import { Fields } from '@/@types/unit'
import ApiService from './ApiService'
import { PrefixFormSchema } from '@/@types/common'

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
    console.log('Updating unit with ID:', id, 'and data:', data) // Debug log;

    return ApiService.fetchDataWithAxios<Fields>({
        url: `/unit/${id}`,
        method: 'put',
        data,
    })
}

export async function fetchPrefixUnitList<T>() {
    return ApiService.fetchDataWithAxios<T>({
        url: '/unit-prefix',
        method: 'get',
    })
}

export async function createPrefixUnit(data: PrefixFormSchema) {
    return ApiService.fetchDataWithAxios<PrefixFormSchema>({
        url: '/unit-prefix',
        method: 'post',
        data,
    })
}

export async function fetchPrefixUnitById(id: string) {
    return ApiService.fetchDataWithAxios<PrefixFormSchema>({
        url: `/unit-prefix/${id}`,
        method: 'get',
    })
}

export async function updatePrefixUnit(id: string, data: PrefixFormSchema) {
    return ApiService.fetchDataWithAxios<PrefixFormSchema>({
        url: `/unit-prefix/${id}`,
        method: 'put',
        data,
    })
}
