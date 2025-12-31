import { Fields, GetSubCategoryDetailResponse } from '@/@types/subcategory'
import ApiService from './ApiService'
import apiEndpointConfig from '@/configs/api-endpoint.config'

export async function apiGetSubCategoryList<
    T,
    U extends Record<string, unknown>,
>(params: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: apiEndpointConfig.subCategories,
        method: 'get',
        params,
    })
}

export async function apiSubCategory(data: Fields) {
    return ApiService.fetchDataWithAxios<GetSubCategoryDetailResponse>({
        url: apiEndpointConfig.subCategories,
        method: 'post',
        data,
    })
}

export async function apiGetSubCategoryById(id: string) {
    return ApiService.fetchDataWithAxios<GetSubCategoryDetailResponse>({
        url: `${apiEndpointConfig.subCategories}/${id}`,
        method: 'get',
    })
}

export async function apiUpdateSubCategory(id: string, data: Fields) {
    return ApiService.fetchDataWithAxios<GetSubCategoryDetailResponse>({
        url: `${apiEndpointConfig.subCategories}/${id}`,
        method: 'put',
        data,
    })
}
