/* eslint-disable @typescript-eslint/no-explicit-any */
import { Fields } from '@/@types/clauses'
import ApiService from './ApiService'
import apiEndpointConfig from '@/configs/api-endpoint.config'

export async function apiGetClausesList<T, U extends Record<string, unknown>>(
    params: U,
) {
    return ApiService.fetchDataWithAxios<T>({
        url: apiEndpointConfig.clauses,
        method: 'get',
        params,
    })
}

export async function apiCreateClauses(data: any) {
    return ApiService.fetchDataWithAxios<any>({
        url: apiEndpointConfig.clauses,
        method: 'post',
        data,
    })
}

export async function apiGetClausesById(id: string) {
    return ApiService.fetchDataWithAxios<Fields>({
        url: `${apiEndpointConfig.clauses}/${id}`,
        method: 'get',
    })
}

export async function apiUpdateClauses(id: string, data: any) {
    return ApiService.fetchDataWithAxios<any>({
        url: `${apiEndpointConfig.clauses}/${id}`,
        method: 'put',
        data,
    })
}
