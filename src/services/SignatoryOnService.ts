import { Fields } from '@/@types/signatoryOn'
import ApiService from './ApiService'

export async function apiGetSignatoryOnList<
    T,
    U extends Record<string, unknown>,
>(params: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/signatoryOn',
        method: 'get',
        params,
    })
}

export async function apiSignatoryOn(data: Fields) {
    return ApiService.fetchDataWithAxios<Fields>({
        url: '/signatoryOn',
        method: 'post',
        data,
    })
}

export async function apiGetSignatoryOnById(id: string) {
    return ApiService.fetchDataWithAxios<Fields>({
        url: `/signatoryOn/${id}`,
        method: 'get',
    })
}

export async function apiUpdateSignatoryOn(id: string, data: Fields) {
    return ApiService.fetchDataWithAxios<Fields>({
        url: `/signatoryOn/${id}`,
        method: 'put',
        data,
    })
}
