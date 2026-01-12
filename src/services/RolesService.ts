import { Fields } from '@/@types/roles'
import ApiService from './ApiService'
import apiEndpointConfig from '@/configs/api-endpoint.config'

export async function apiGetRolesList<T, U extends Record<string, unknown>>(
    params: U,
) {
    return ApiService.fetchDataWithAxios<T>({
        url: apiEndpointConfig.roles,
        method: 'get',
        params,
    })
}

export async function apiGetAccesModulesList<T>() {
    return ApiService.fetchDataWithAxios<T>({
        url: apiEndpointConfig.accessModules,
        method: 'get',
    })
}

export async function apiGetRoleLevelsList<T>() {
    return ApiService.fetchDataWithAxios<T>({
        url: apiEndpointConfig.roleLevels,
        method: 'get',
    })
}

export async function apiRoles(data: Fields) {
    return ApiService.fetchDataWithAxios<Fields>({
        url: apiEndpointConfig.roles,
        method: 'post',
        data,
    })
}

export async function apiGetRolesById(id: string) {
    return ApiService.fetchDataWithAxios<Fields>({
        url: `${apiEndpointConfig.roles}/${id}`,
        method: 'get',
    })
}

export async function apiUpdateRoles(id: string, data: Fields) {
    return ApiService.fetchDataWithAxios<Fields>({
        url: `${apiEndpointConfig.roles}/${id}`,
        method: 'put',
        data,
    })
}
