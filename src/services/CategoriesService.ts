import { Fields, GetCategoryDetailResponse } from '@/@types/category'
import ApiService from './ApiService'
import apiEndpointConfig from '@/configs/api-endpoint.config'

export async function apiGetCategoryList<T, U extends Record<string, unknown>>(
    params: U,
) {
    return ApiService.fetchDataWithAxios<T>({
        url: apiEndpointConfig.categories,
        method: 'get',
        params,
    })
}

export async function apiCategory(data: Fields) {
    return ApiService.fetchDataWithAxios<GetCategoryDetailResponse>({
        url: apiEndpointConfig.categories,
        method: 'post',
        data,
    })
}

export async function apiGetCategoryById(id: string) {
    return ApiService.fetchDataWithAxios<GetCategoryDetailResponse>({
        url: `${apiEndpointConfig.categories}/${id}`,
        method: 'get',
    })
}

export async function apiUpdateCategory(id: string, data: Fields) {
    return ApiService.fetchDataWithAxios<GetCategoryDetailResponse>({
        url: `${apiEndpointConfig.categories}/${id}`,
        method: 'put',
        data,
    })
}

export async function apiGetLabMasterCategories(labId: number) {
    return ApiService.fetchDataWithAxios({
        url: `${apiEndpointConfig.categories}/lab-master`,
        method: 'get',
        params: { lab_id: labId },
    })
}

export async function apiAppendLabCategoryToMaster(labCategoryId: number) {
    return ApiService.fetchDataWithAxios({
        url: `${apiEndpointConfig.categories}/append-to-master`,
        method: 'post',
        data: {
            lab_category_id: labCategoryId,
        },
    })
}
