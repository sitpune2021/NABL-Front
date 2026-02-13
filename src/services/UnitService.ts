import { Fields, GetUnitDetailResponse } from '@/@types/unit'
import ApiService from './ApiService'
import apiEndpointConfig from '@/configs/api-endpoint.config'

export async function apiGetUnitList<T, U extends Record<string, unknown>>(
    params: U,
) {
    return ApiService.fetchDataWithAxios<T>({
        url: apiEndpointConfig.units,
        method: 'get',
        params,
    })
}

export async function apiUnit(data: Fields) {
    return ApiService.fetchDataWithAxios<GetUnitDetailResponse>({
        url: apiEndpointConfig.units,
        method: 'post',
        data,
    })
}

export async function apiGetUnitById(id: string) {
    return ApiService.fetchDataWithAxios<GetUnitDetailResponse>({
        url: `${apiEndpointConfig.units}/${id}`,
        method: 'get',
    })
}

export async function apiUpdateUnit(id: string, data: Fields) {
    return ApiService.fetchDataWithAxios<GetUnitDetailResponse>({
        url: `${apiEndpointConfig.units}/${id}`,
        method: 'put',
        data,
    })
}
export async function apiGetLabMasterUnits(labId: number) {
    return ApiService.fetchDataWithAxios({
        url: `${apiEndpointConfig.units}/lab-master`,
        method: 'get',
        params: { lab_id: labId },
    })
}

export async function apiAppendLabUnitToMaster(labUnitId: number) {
    return ApiService.fetchDataWithAxios({
        url: `${apiEndpointConfig.units}/append-to-master`,
        method: 'post',
        data: {
            lab_unit_id: labUnitId,
        },
    })
}
