import ApiService from './ApiService'
import apiEndpointConfig from '@/configs/api-endpoint.config'

export async function apiGetNavigationItemsList<T>() {
    return ApiService.fetchDataWithAxios<T>({
        url: apiEndpointConfig.navigationItems,
        method: 'get',
    })
}
