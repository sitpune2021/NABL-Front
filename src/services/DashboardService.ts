import ApiService from './ApiService'

export async function apiGetEcommerceDashboard<T>() {
    return ApiService.fetchDataWithAxios<T>({
        url: '/api/v1/dashboard/ecommerce',
        method: 'get',
    })
}
