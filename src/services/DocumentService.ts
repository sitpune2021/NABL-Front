import { Fields, GetDocumentResponse } from '@/@types/document'
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
    return ApiService.fetchDataWithAxios<GetDocumentResponse>({
        url: '/document',
        method: 'post',
        data,
    })
}

export async function apiGetDocumentById(id: string) {
    return ApiService.fetchDataWithAxios<GetDocumentResponse>({
        url: `/document/${id}`,
        method: 'get',
    })
}

export async function apiUpdateDocument(id: string, data: Fields) {
    return ApiService.fetchDataWithAxios<GetDocumentResponse>({
        url: `/document/${id}`,
        method: 'put',
        data,
    })
}

export async function apiDocumenEditort(data: Fields) {
    return ApiService.fetchDataWithAxios<GetDocumentResponse>({
        url: '/document-editor',
        method: 'post',
        data,
    })
}

export async function apiGetDocumentEditortById(id: string) {
    return ApiService.fetchDataWithAxios<Fields>({
        url: `/document-editor/${id}`,
        method: 'get',
    })
}

export async function apiUpdateDocumentEditor(id: string, data: Fields) {
    return ApiService.fetchDataWithAxios<GetDocumentResponse>({
        url: `/document-editor/${id}`,
        method: 'put',
        data,
    })
}
