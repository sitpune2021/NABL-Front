import { Fields } from '@/@types/department'
import ApiService from './ApiService'
import { GetZoneDetailResponse } from '@/@types/zone'
import apiEndpointConfig from '@/configs/api-endpoint.config'

export async function apiGetDepartmentList<
    T,
    U extends Record<string, unknown>,
>(params: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: apiEndpointConfig.departments,
        method: 'get',
        params,
    })
}

export async function apiDepartment(data: Fields) {
    return ApiService.fetchDataWithAxios<Fields>({
        url: apiEndpointConfig.departments,
        method: 'post',
        data,
    })
}

export async function apiGetDepartmentById(id: string) {
    return ApiService.fetchDataWithAxios<GetZoneDetailResponse>({
        url: `${apiEndpointConfig.departments}/${id}`,
        method: 'get',
    })
}

export async function apiUpdateDepartment(id: string, data: Fields) {
    return ApiService.fetchDataWithAxios<Fields>({
        url: `${apiEndpointConfig.departments}/${id}`,
        method: 'put',
        data,
    })
}
