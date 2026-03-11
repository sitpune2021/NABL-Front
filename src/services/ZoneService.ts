import { Fields, GetZoneDetailResponse } from '@/@types/zone'
import ApiService from './ApiService'
import apiEndpointConfig from '@/configs/api-endpoint.config'

export async function apiGetZoneList<T, U extends Record<string, unknown>>(
    params: U,
) {
    return ApiService.fetchDataWithAxios<T>({
        url: apiEndpointConfig.zones,
        method: 'get',
        params,
    })
}

export async function apiZone(data: Fields) {
    return ApiService.fetchDataWithAxios<GetZoneDetailResponse>({
        url: apiEndpointConfig.zones,
        method: 'post',
        data,
    })
}

export async function apiGetZoneById(id: string) {
    return ApiService.fetchDataWithAxios<GetZoneDetailResponse>({
        url: `${apiEndpointConfig.zones}/${id}`,
        method: 'get',
    })
}

export async function apiUpdateZone(id: string, data: Fields) {
    return ApiService.fetchDataWithAxios<GetZoneDetailResponse>({
        url: `${apiEndpointConfig.zones}/${id}`,
        method: 'put',
        data,
    })
}
export async function apiGetLabMasterZones<
    T,
    U extends Record<string, unknown>,
>(params: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: `${apiEndpointConfig.zones}${apiEndpointConfig.syncMaster}`,
        method: 'get',
        params,
    })
}

export async function apiAppendLabZoneToMaster(labZoneId: number) {
    return ApiService.fetchDataWithAxios({
        url: `${apiEndpointConfig.zones}/append-to-master`,
        method: 'post',
        data: {
            lab_zone_id: labZoneId,
        },
    })
}

export async function apiGetLabAllZones(labId: number) {
    return ApiService.fetchDataWithAxios({
        url: `${apiEndpointConfig.zones}/lab-all`,
        method: 'get',
        params: { lab_id: labId },
    })
}
export async function apiAppendMasterZoneToLab(
    masterZoneId: number,
    labId: number,
) {
    return ApiService.fetchDataWithAxios({
        url: `${apiEndpointConfig.zones}/append-to-lab`,
        method: 'post',
        data: {
            master_zone_id: masterZoneId,
            lab_id: labId,
        },
    })
}
export async function apiGetPendingZones() {
    return ApiService.fetchDataWithAxios({
        url: `${apiEndpointConfig.zones}/pending`,
        method: 'get',
    })
}
export async function apiApproveZones(ids: number[]) {
    return ApiService.fetchDataWithAxios({
        url: `${apiEndpointConfig.zones}/approve`,
        method: 'post',
        data: { ids },
    })
}
