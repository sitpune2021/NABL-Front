import { Fields, GetClusterDetailResponse } from '@/@types/cluster'
import ApiService from './ApiService'
import apiEndpointConfig from '@/configs/api-endpoint.config'

export async function apiGetClusterList<T, U extends Record<string, unknown>>(
    params: U,
) {
    return ApiService.fetchDataWithAxios<T>({
        url: apiEndpointConfig.clusters,
        method: 'get',
        params,
    })
}

export async function apiCluster(data: Fields) {
    return ApiService.fetchDataWithAxios<Fields>({
        url: apiEndpointConfig.clusters,
        method: 'post',
        data,
    })
}

export async function apiGetClusterById(id: string) {
    return ApiService.fetchDataWithAxios<GetClusterDetailResponse>({
        url: `${apiEndpointConfig.clusters}/${id}`,
        method: 'get',
    })
}

export async function apiUpdateCluster(id: string, data: Fields) {
    return ApiService.fetchDataWithAxios<Fields>({
        url: `${apiEndpointConfig.clusters}/${id}`,
        method: 'put',
        data,
    })
}
