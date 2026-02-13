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

export async function apiGetLabSubCategories(
    labId: number,
    categoryId: number,
) {
    return ApiService.fetchDataWithAxios({
        url: `${apiEndpointConfig.subCategories}/lab-master`,
        method: 'get',
        params: {
            lab_id: labId,
            category_id: categoryId,
        },
    })
}

export async function apiAppendLabSubCategoryToMaster(
    labSubCategoryId: number,
) {
    return ApiService.fetchDataWithAxios({
        url: `${apiEndpointConfig.subCategories}/append-to-master`,
        method: 'post',
        data: { lab_subcategory_id: labSubCategoryId },
    })
}
