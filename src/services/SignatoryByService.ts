import { Fields } from '@/@types/signatoryBy'
import ApiService from './ApiService'

export async function apiGetSignatoryByList<
    T,
    U extends Record<string, unknown>,
>(params: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/signatoryBy',
        method: 'get',
        params,
    })
}

export async function apiSignatoryBy(data: Fields) {
    return ApiService.fetchDataWithAxios<Fields>({
        url: '/signatoryBy',
        method: 'post',
        data,
    })
}

export async function apiGetSignatoryByById(id: string) {
    return ApiService.fetchDataWithAxios<Fields>({
        url: `/signatoryBy/${id}`,
        method: 'get',
    })
}

export async function apiUpdateSignatoryBy(id: string, data: Fields) {
    console.log('Updating signatoryBy with ID:', id, 'and data:', data) // Debug log;

    return ApiService.fetchDataWithAxios<Fields>({
        url: `/signatoryBy/${id}`,
        method: 'put',
        data,
    })
}
