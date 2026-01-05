import { Fields, GetInstrumentDetailResponse } from '@/@types/instrument'
import ApiService from './ApiService'
import apiEndpointConfig from '@/configs/api-endpoint.config'

export async function apiGetInstrumentList<
    T,
    U extends Record<string, unknown>,
>(params: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: apiEndpointConfig.instruments,
        method: 'get',
        params,
    })
}

export async function apiInstrument(data: Fields) {
    return ApiService.fetchDataWithAxios<GetInstrumentDetailResponse>({
        url: apiEndpointConfig.instruments,
        method: 'post',
        data,
    })
}

export async function apiGetInstrumentById(id: string) {
    return ApiService.fetchDataWithAxios<GetInstrumentDetailResponse>({
        url: `${apiEndpointConfig.instruments}/${id}`,
        method: 'get',
    })
}

export async function apiUpdateInstrument(id: string, data: Fields) {
    return ApiService.fetchDataWithAxios<GetInstrumentDetailResponse>({
        url: `${apiEndpointConfig.instruments}/${id}`,
        method: 'put',
        data,
    })
}
