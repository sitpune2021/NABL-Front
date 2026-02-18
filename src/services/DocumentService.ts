/* eslint-disable @typescript-eslint/no-explicit-any */
import { GetDocumentResponse } from '@/@types/document'
import ApiService from './ApiService'
import apiEndpointConfig from '@/configs/api-endpoint.config'
import { DocumentFormSchema } from '@/schemas/document.schema'

export async function apiGetDocumentList<T, U extends Record<string, unknown>>(
    params: U,
) {
    return ApiService.fetchDataWithAxios<T>({
        url: apiEndpointConfig.documents,
        method: 'get',
        params,
    })
}

export async function apiDocument(data: DocumentFormSchema) {
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

export async function apiUpdateDocument(id: string, data: DocumentFormSchema) {
    return ApiService.fetchDataWithAxios<GetDocumentResponse>({
        url: `${apiEndpointConfig.documents}/${id}`,
        method: 'put',
        data,
    })
}

export async function apiDocumentWorkFlow(data: any) {
    return ApiService.fetchDataWithAxios<any>({
        url: apiEndpointConfig.documentsWorkflowAction,
        method: 'post',
        data,
    })
}

export async function apiGenerateDocumentNumber(params: {
    departmentName: string
}) {
    return ApiService.fetchDataWithAxios<{ documentNumber: string }>({
        url: apiEndpointConfig.generateDocumentNumber,
        method: 'get',
        params,
    })
}
