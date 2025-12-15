import { Fields, GetLabDetailResponse } from '@/@types/lab'
import ApiService from './ApiService'

export async function apiGetLabList<T, U extends Record<string, unknown>>(
    params: U,
) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/lab',
        method: 'get',
        params,
    })
}

export async function apiLab(data: Fields) {
    return ApiService.fetchDataWithAxios<Fields>({
        url: '/lab',
        method: 'post',
        data,
    })
}

export async function apiGetLabById(id: string) {
    return ApiService.fetchDataWithAxios<GetLabDetailResponse>({
        url: `/lab/${id}`,
        method: 'get',
    })
}

export async function apiUpdateLab(id: string, data: Fields) {
    return ApiService.fetchDataWithAxios<Fields>({
        url: `/lab/${id}`,
        method: 'put',
        data,
    })
}
