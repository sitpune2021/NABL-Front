import { Fields, GetClausesDetailResponse } from '@/@types/clauses'
import ApiService from './ApiService'

export async function apiGetClausesList<T, U extends Record<string, unknown>>(
    params: U,
) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/clauses',
        method: 'get',
        params,
    })
}

export async function apiGetClausesDataList<T>() {
    return ApiService.fetchDataWithAxios<T>({
        url: '/clauses-data',
        method: 'get',
    })
}

export async function apiCreateClauses(data: Fields) {
    return ApiService.fetchDataWithAxios<Fields>({
        url: '/clauses',
        method: 'post',
        data,
    })
}

export async function apiGetClausesById(id: string) {
    return ApiService.fetchDataWithAxios<GetClausesDetailResponse>({
        url: `/clauses/${id}`,
        method: 'get',
    })
}

export async function apiUpdateClauses(id: string, data: Fields) {
    return ApiService.fetchDataWithAxios<Fields>({
        url: `/clauses/${id}`,
        method: 'put',
        data,
    })
}
