import ApiService from './ApiService'

export async function apiGetEcommerceDashboard<T>() {
    return ApiService.fetchDataWithAxios<T>({
        url: '/api/dashboard/ecommerce',
        method: 'get',
    })
}
