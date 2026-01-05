/* eslint-disable @typescript-eslint/no-explicit-any */
import navigationConfig from '@/configs/navigation.config'
import ApiService from './ApiService'
import apiEndpointConfig from '@/configs/api-endpoint.config'

export async function apiGetNavigationItemsList<T>() {
    return ApiService.fetchDataWithAxios<T>({
        url: apiEndpointConfig.navigationItems,
        method: 'get',
    })
}

export async function apiNavigationItems() {
    return ApiService.fetchDataWithAxios<any>({
        url: apiEndpointConfig.navigationItems,
        method: 'post',
        data: navigationConfig as any,
    })
}
