import { Fields } from '@/@types/user'
import ApiService from './ApiService'

export async function apiGetUserList<T, U extends Record<string, unknown>>(
    params: U,
) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/user',
        method: 'get',
        params,
    })
}

export async function apiUser(data: Fields) {
    return ApiService.fetchDataWithAxios<Fields>({
        url: '/user',
        method: 'post',
        data,
    })
}

export async function apiGetUserById(id: string) {
    return ApiService.fetchDataWithAxios<Fields>({
        url: `/user/${id}`,
        method: 'get',
    })
}

export async function apiUpdateUser(id: string, data: Fields) {
    console.log('Updating user with ID:', id, 'and data:', data) // Debug log;

    return ApiService.fetchDataWithAxios<Fields>({
        url: `/user/${id}`,
        method: 'put',
        data,
    })
}
