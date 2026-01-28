/* eslint-disable @typescript-eslint/no-explicit-any */
import { GetMenuDetailResponse } from '@/@types/menu'
import ApiService from './ApiService'
import apiEndpointConfig from '@/configs/api-endpoint.config'

export async function apiGetMenuList<T, U extends Record<string, unknown>>(
    params: U,
) {
    return ApiService.fetchDataWithAxios<T>({
        url: apiEndpointConfig.menu,
        method: 'get',
        params,
    })
}

export async function apiGetMenuById(id: string) {
    return ApiService.fetchDataWithAxios<GetMenuDetailResponse>({
        url: `${apiEndpointConfig.menu}/${id}`,
        method: 'get',
    })
}

export async function apiUpdateMenu(id: string, data: any) {
    return ApiService.fetchDataWithAxios<GetMenuDetailResponse>({
        url: `${apiEndpointConfig.menu}/${id}`,
        method: 'put',
        data,
    })
}
