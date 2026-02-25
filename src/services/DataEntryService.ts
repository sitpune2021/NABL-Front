/* eslint-disable @typescript-eslint/no-explicit-any */
import ApiService from './ApiService'
import apiEndpointConfig from '@/configs/api-endpoint.config'

export async function apiDataEntry(data: any) {
    return ApiService.fetchDataWithAxios<any>({
        url: apiEndpointConfig.dataEntry,
        method: 'post',
        data,
    })
}

export async function apiDataEntryList(id: any) {
    return ApiService.fetchDataWithAxios<any>({
        url: `${apiEndpointConfig.dataEntry}/${id}`,
        method: 'get',
    })
}

export async function apiDataEntryTaskList() {
    return ApiService.fetchDataWithAxios<any>({
        url: `${apiEndpointConfig.dataEntry}`,
        method: 'get',
    })
}
