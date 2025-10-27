import { Fields } from '@/@types/cluster'
import ApiService from './ApiService'
import { PrefixFormSchema } from '@/@types/common'

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
    return ApiService.fetchDataWithAxios<Fields>({
        url: `/cluster/${id}`,
        method: 'get',
    })
}

export async function apiUpdateCluster(id: string, data: Fields) {
    console.log('Updating cluster with ID:', id, 'and data:', data) // Debug log;

    return ApiService.fetchDataWithAxios<Fields>({
        url: `/cluster/${id}`,
        method: 'put',
        data,
    })
}

export async function fetchPrefixClusterList<T>() {
    return ApiService.fetchDataWithAxios<T>({
        url: '/cluster-prefix',
        method: 'get',
    })
}

export async function createPrefixCluster(data: PrefixFormSchema) {
    return ApiService.fetchDataWithAxios<PrefixFormSchema>({
        url: '/cluster-prefix',
        method: 'post',
        data,
    })
}

export async function fetchPrefixClusterById(id: string) {
    return ApiService.fetchDataWithAxios<PrefixFormSchema>({
        url: `/cluster-prefix/${id}`,
        method: 'get',
    })
}

export async function updatePrefixCluster(id: string, data: PrefixFormSchema) {
    return ApiService.fetchDataWithAxios<PrefixFormSchema>({
        url: `/cluster-prefix/${id}`,
        method: 'put',
        data,
    })
}
