import { Fields, GetDocumentResponse } from '@/@types/document'
import ApiService from './ApiService'
import apiEndpointConfig from '@/configs/api-endpoint.config'

export async function apiGetDocumentList<T, U extends Record<string, unknown>>(
    params: U,
) {
    return ApiService.fetchDataWithAxios<T>({
        url: apiEndpointConfig.documents,
        method: 'get',
        params,
    })
}

export async function apiDocument(data: Fields) {
    return ApiService.fetchDataWithAxios<GetDocumentResponse>({
        url: apiEndpointConfig.documents,
        method: 'post',
        data,
    })
}

export async function apiGetDocumentById(id: string) {
    return ApiService.fetchDataWithAxios<GetDocumentResponse>({
        url: `${apiEndpointConfig.documents}/${id}`,
        method: 'get',
    })
}

export async function apiUpdateDocument(id: string, data: Fields) {
    return ApiService.fetchDataWithAxios<GetDocumentResponse>({
        url: `${apiEndpointConfig.documents}/${id}`,
        method: 'put',
        data,
    })
}
