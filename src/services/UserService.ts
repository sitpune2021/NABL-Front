import { Fields } from '@/@types/user'
import ApiService from './ApiService'
import apiEndpointConfig from '@/configs/api-endpoint.config'

export async function apiGetUserList<T, U extends Record<string, unknown>>(
    params: U,
) {
    return ApiService.fetchDataWithAxios<T>({
        url: apiEndpointConfig.users,
        method: 'get',
        params,
    })
}

export async function apiUser(data: Fields) {
    return ApiService.fetchDataWithAxios<Fields>({
        url: apiEndpointConfig.users,
        method: 'post',
        data,
    })
}

export async function apiGetUserById(id: string) {
    return ApiService.fetchDataWithAxios<Fields>({
        url: `${apiEndpointConfig.users}/${id}`,
        method: 'get',
    })
}

export async function apiUpdateUser(id: string, data: Fields) {
    return ApiService.fetchDataWithAxios<Fields>({
        url: `${apiEndpointConfig.users}/${id}`,
        method: 'put',
        data,
    })
}
