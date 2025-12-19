import { Fields, GetClusterDetailResponse } from '@/@types/cluster'
import ApiService from './ApiService'

export async function apiGetClusterList<T, U extends Record<string, unknown>>(
    params: U,
) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/cluster',
        method: 'get',
        params,
    })
}

export async function apiCluster(data: Fields) {
    return ApiService.fetchDataWithAxios<Fields>({
        url: '/cluster',
        method: 'post',
        data,
    })
}

export async function apiGetClusterById(id: string) {
    return ApiService.fetchDataWithAxios<GetClusterDetailResponse>({
        url: `/cluster/${id}`,
        method: 'get',
    })
}

export async function apiUpdateCluster(id: string, data: Fields) {
    return ApiService.fetchDataWithAxios<Fields>({
        url: `/cluster/${id}`,
        method: 'put',
        data,
    })
}
