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

export async function apiGetLabSubCategories<
    T,
    U extends Record<string, unknown>,
>(params: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: `${apiEndpointConfig.subCategories}${apiEndpointConfig.syncMaster}`,
        method: 'get',
        params,
    })
}

// export async function apiAppendLabSubCategoryToMaster(
//     labSubCategoryId: number,
// ) {
//     return ApiService.fetchDataWithAxios({
//         url: `${apiEndpointConfig.subCategories}/append-to-master`,
//         method: 'post',
//         data: { lab_subcategory_id: labSubCategoryId },
//     })
// }

export async function apiAppendLabSubCategoryToMaster(
    labSubCategoryId: number,
    forceAppendCategory?: boolean,
) {
    return ApiService.fetchDataWithAxios({
        url: `${apiEndpointConfig.subCategories}/append-to-master`,
        method: 'post',
        data: {
            lab_subcategory_id: labSubCategoryId,
            force_append_category: forceAppendCategory ?? false,
        },
    })
}
export async function apiGetPendingSubCategories<T>() {
    return ApiService.fetchDataWithAxios<T>({
        url: `${apiEndpointConfig.subCategories}/pending`,
        method: 'get',
    })
}

export async function apiApproveSubCategories(ids: number[]) {
    return ApiService.fetchDataWithAxios({
        url: `${apiEndpointConfig.subCategories}/approve`,
        method: 'post',
        data: { ids },
    })
}
