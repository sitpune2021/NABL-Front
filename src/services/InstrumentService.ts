import { Fields } from '@/@types/instrument'
import ApiService from './ApiService'
import { PrefixFormSchema } from '@/@types/common'

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
    return ApiService.fetchDataWithAxios<Fields>({
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

export async function fetchPrefixInstrumentList<T>() {
    return ApiService.fetchDataWithAxios<T>({
        url: '/instrument-prefix',
        method: 'get',
    })
}

export async function createPrefixInstrument(data: PrefixFormSchema) {
    return ApiService.fetchDataWithAxios<PrefixFormSchema>({
        url: '/instrument-prefix',
        method: 'post',
        data,
    })
}

export async function fetchPrefixInstrumentById(id: string) {
    return ApiService.fetchDataWithAxios<PrefixFormSchema>({
        url: `/instrument-prefix/${id}`,
        method: 'get',
    })
}

export async function updatePrefixInstrument(
    id: string,
    data: PrefixFormSchema,
) {
    return ApiService.fetchDataWithAxios<PrefixFormSchema>({
        url: `/instrument-prefix/${id}`,
        method: 'put',
        data,
    })
}
