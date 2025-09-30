import { Fields } from '@/@types/document'
import ApiService from './ApiService'

export async function apiGetDocumentList<T, U extends Record<string, unknown>>(
    params: U,
) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/document',
        method: 'get',
        params,
    })
}

export async function apiDocument(data: Fields) {
    return ApiService.fetchDataWithAxios<Fields>({
        url: '/document',
        method: 'post',
        data,
    })
}

export async function apiGetDocumentById(id: string) {
    return ApiService.fetchDataWithAxios<Fields>({
        url: `/document/${id}`,
        method: 'get',
    })
}

export async function apiUpdateDocument(id: string, data: Fields) {
    console.log('Updating document with ID:', id, 'and data:', data) // Debug log;

    return ApiService.fetchDataWithAxios<Fields>({
        url: `/document/${id}`,
        method: 'put',
        data,
    })
}
