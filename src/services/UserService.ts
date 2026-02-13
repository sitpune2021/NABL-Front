import { GetUserDetailResponse, User } from '@/@types/user'
import ApiService from './ApiService'
import apiEndpointConfig from '@/configs/api-endpoint.config'
import { UserSchemaType } from '@/schemas/user.schema'

export async function apiGetUserList<T, U extends Record<string, unknown>>(
    params: U,
) {
    return ApiService.fetchDataWithAxios<T>({
        url: apiEndpointConfig.users,
        method: 'get',
        params,
    })
}

export async function apiUser(data: UserSchemaType) {
    return ApiService.fetchDataWithAxios<User>({
        url: apiEndpointConfig.users,
        method: 'post',
        data,
    })
}

export async function apiGetUserById(id: string) {
    return ApiService.fetchDataWithAxios<GetUserDetailResponse>({
        url: `${apiEndpointConfig.users}/${id}`,
        method: 'get',
    })
}

export async function apiUpdateUser(id: string, data: UserSchemaType) {
    return ApiService.fetchDataWithAxios<User>({
        url: `${apiEndpointConfig.users}/${id}`,
        method: 'put',
        data,
    })
}
