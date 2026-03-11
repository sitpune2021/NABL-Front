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

export async function apiGetLabMasterCategories<
    T,
    U extends Record<string, unknown>,
>(params: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: `${apiEndpointConfig.categories}${apiEndpointConfig.syncMaster}`,
        method: 'get',
        params,
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

export async function apiGetLabAllCategories(labId: number) {
    return ApiService.fetchDataWithAxios({
        url: `${apiEndpointConfig.categories}/lab-all`,
        method: 'get',
        params: { lab_id: labId },
    })
}
export async function apiAppendMasterCategoryToLab(
    masterCategoryId: number,
    labId: number,
) {
    return ApiService.fetchDataWithAxios({
        url: `${apiEndpointConfig.categories}/append-to-lab`,
        method: 'post',
        data: {
            master_category_id: masterCategoryId,
            lab_id: labId,
        },
    })
}
export async function apiGetPendingCategories() {
    return ApiService.fetchDataWithAxios({
        url: `${apiEndpointConfig.categories}/pending`,
        method: 'get',
    })
}
export async function apiApproveCategories(ids: number[]) {
    return ApiService.fetchDataWithAxios({
        url: `${apiEndpointConfig.categories}/approve`,
        method: 'post',
        data: { ids },
    })
}
