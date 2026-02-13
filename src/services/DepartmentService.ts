import { Fields, GetDepartmentDetailResponse } from '@/@types/department'
import ApiService from './ApiService'
import apiEndpointConfig from '@/configs/api-endpoint.config'

export async function apiGetDepartmentList<
    T,
    U extends Record<string, unknown>,
>(params: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: apiEndpointConfig.departments,
        method: 'get',
        params,
    })
}

export async function apiDepartment(data: Fields) {
    return ApiService.fetchDataWithAxios<GetDepartmentDetailResponse>({
        url: apiEndpointConfig.departments,
        method: 'post',
        data,
    })
}

export async function apiGetDepartmentById(id: string) {
    return ApiService.fetchDataWithAxios<GetDepartmentDetailResponse>({
        url: `${apiEndpointConfig.departments}/${id}`,
        method: 'get',
    })
}

export async function apiUpdateDepartment(id: string, data: Fields) {
    return ApiService.fetchDataWithAxios<GetDepartmentDetailResponse>({
        url: `${apiEndpointConfig.departments}/${id}`,
        method: 'put',
        data,
    })
}

export async function apiGetLabMasterDepartments(labId: number) {
    return ApiService.fetchDataWithAxios({
        url: `${apiEndpointConfig.departments}/lab-master`,
        method: 'get',
        params: { lab_id: labId },
    })
}

export async function apiAppendLabDepartmentToMaster(labDepartmentId: number) {
    return ApiService.fetchDataWithAxios({
        url: `${apiEndpointConfig.departments}/append-to-master`,
        method: 'post',
        data: {
            lab_department_id: labDepartmentId,
        },
    })
}
