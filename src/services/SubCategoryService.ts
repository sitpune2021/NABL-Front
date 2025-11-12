import { Fields, GetSubCategoryDetailResponse } from '@/@types/subcategory'
import ApiService from './ApiService'

export async function apiGetSubCategoryList<
    T,
    U extends Record<string, unknown>,
>(params: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/sub-category',
        method: 'get',
        params,
    })
}

export async function apiSubCategory(data: Fields) {
    return ApiService.fetchDataWithAxios<Fields>({
        url: '/sub-category',
        method: 'post',
        data,
    })
}

export async function apiGetSubCategoryById(id: string) {
    return ApiService.fetchDataWithAxios<GetSubCategoryDetailResponse>({
        url: `/sub-category/${id}`,
        method: 'get',
    })
}

export async function apiUpdateSubCategory(id: string, data: Fields) {
    console.log('Updating subcategory with ID:', id, 'and data:', data) // Debug log;

    return ApiService.fetchDataWithAxios<Fields>({
        url: `/sub-category/${id}`,
        method: 'put',
        data,
    })
}
