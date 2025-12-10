import { Fields } from '@/@types/department'
import ApiService from './ApiService'
import { PrefixFormSchema } from '@/@types/common'
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

export async function fetchPrefixDepartmentList<T>() {
    return ApiService.fetchDataWithAxios<T>({
        url: '/department-prefix',
        method: 'get',
    })
}

export async function createPrefixDepartment(data: PrefixFormSchema) {
    return ApiService.fetchDataWithAxios<PrefixFormSchema>({
        url: '/department-prefix',
        method: 'post',
        data,
    })
}

export async function fetchPrefixDepartmentById(id: string) {
    return ApiService.fetchDataWithAxios<PrefixFormSchema>({
        url: `/department-prefix/${id}`,
        method: 'get',
    })
}

export async function updatePrefixDepartment(
    id: string,
    data: PrefixFormSchema,
) {
    return ApiService.fetchDataWithAxios<PrefixFormSchema>({
        url: `/department-prefix/${id}`,
        method: 'put',
        data,
    })
}
