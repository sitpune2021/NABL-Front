import { Fields } from '@/@types/department'
import ApiService from './ApiService'
import { GetZoneDetailResponse } from '@/@types/zone'

export async function apiGetDepartmentList<
    T,
    U extends Record<string, unknown>,
>(params: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/department',
        method: 'get',
        params,
    })
}

export async function apiDepartment(data: Fields) {
    return ApiService.fetchDataWithAxios<Fields>({
        url: '/department',
        method: 'post',
        data,
    })
}

export async function apiGetDepartmentById(id: string) {
    return ApiService.fetchDataWithAxios<GetZoneDetailResponse>({
        url: `/department/${id}`,
        method: 'get',
    })
}

export async function apiUpdateDepartment(id: string, data: Fields) {
    return ApiService.fetchDataWithAxios<Fields>({
        url: `/department/${id}`,
        method: 'put',
        data,
    })
}
