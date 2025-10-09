import { Fields } from '@/@types/clauses'
import ApiService from './ApiService'
import { PrefixFormSchema } from '@/@types/common'

export async function apiGetClausesList<T, U extends Record<string, unknown>>(
    params: U,
) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/clauses',
        method: 'get',
        params,
    })
}

export async function apiClauses(data: Fields) {
    return ApiService.fetchDataWithAxios<Fields>({
        url: '/clauses',
        method: 'post',
        data,
    })
}

export async function apiGetClausesById(id: string) {
    return ApiService.fetchDataWithAxios<Fields>({
        url: `/clauses/${id}`,
        method: 'get',
    })
}

export async function apiUpdateClauses(id: string, data: Fields) {
    console.log('Updating clauses with ID:', id, 'and data:', data) // Debug log;

    return ApiService.fetchDataWithAxios<Fields>({
        url: `/clauses/${id}`,
        method: 'put',
        data,
    })
}

export async function fetchPrefixClausesList<T>() {
    return ApiService.fetchDataWithAxios<T>({
        url: '/clauses-prefix',
        method: 'get',
    })
}

export async function createPrefixClauses(data: PrefixFormSchema) {
    return ApiService.fetchDataWithAxios<PrefixFormSchema>({
        url: '/clauses-prefix',
        method: 'post',
        data,
    })
}

export async function fetchPrefixClausesById(id: string) {
    return ApiService.fetchDataWithAxios<PrefixFormSchema>({
        url: `/clauses-prefix/${id}`,
        method: 'get',
    })
}

export async function updatePrefixClauses(id: string, data: PrefixFormSchema) {
    return ApiService.fetchDataWithAxios<PrefixFormSchema>({
        url: `/clauses-prefix/${id}`,
        method: 'put',
        data,
    })
}
