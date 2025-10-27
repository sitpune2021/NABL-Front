import ApiService from './ApiService'

export async function apiGetNavigationItemsList<T>() {
    return ApiService.fetchDataWithAxios<T>({
        url: '/navigation-items',
        method: 'get',
    })
}
