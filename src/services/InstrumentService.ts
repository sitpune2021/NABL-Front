import { Fields, GetInstrumentDetailResponse } from '@/@types/instrument'
import ApiService from './ApiService'

export async function apiGetInstrumentList<
    T,
    U extends Record<string, unknown>,
>(params: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/instrument',
        method: 'get',
        params,
    })
}

export async function apiInstrument(data: Fields) {
    return ApiService.fetchDataWithAxios<Fields>({
        url: '/instrument',
        method: 'post',
        data,
    })
}

export async function apiGetInstrumentById(id: string) {
    return ApiService.fetchDataWithAxios<GetInstrumentDetailResponse>({
        url: `/instrument/${id}`,
        method: 'get',
    })
}

export async function apiUpdateInstrument(id: string, data: Fields) {
    return ApiService.fetchDataWithAxios<Fields>({
        url: `/instrument/${id}`,
        method: 'put',
        data,
    })
}
