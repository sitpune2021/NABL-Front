/* eslint-disable @typescript-eslint/no-explicit-any */
import navigationConfig from '@/configs/navigation.config'
import ApiService from './ApiService'

export async function apiGetNavigationItemsList<T>() {
    return ApiService.fetchDataWithAxios<T>({
        url: '/navigation-items',
        method: 'get',
    })
}

export async function apiNavigationItems() {
    return ApiService.fetchDataWithAxios<any>({
        url: '/navigation-items',
        method: 'post',
        data: navigationConfig as any,
    })
}
