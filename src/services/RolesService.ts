import { Fields } from '@/@types/roles'
import ApiService from './ApiService'

export async function apiGetRolesList<T, U extends Record<string, unknown>>(
    params: U,
) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/roles',
        method: 'get',
        params,
    })
}

export async function apiRoles(data: Fields) {
    return ApiService.fetchDataWithAxios<Fields>({
        url: '/roles',
        method: 'post',
        data,
    })
}

export async function apiGetRolesById(id: string) {
    return ApiService.fetchDataWithAxios<Fields>({
        url: `/roles/${id}`,
        method: 'get',
    })
}

export async function apiUpdateRoles(id: string, data: Fields) {
    console.log('Updating roles with ID:', id, 'and data:', data) // Debug log;

    return ApiService.fetchDataWithAxios<Fields>({
        url: `/roles/${id}`,
        method: 'put',
        data,
    })
}
