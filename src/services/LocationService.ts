import { Fields, GetLocationDetailResponse } from '@/@types/location'
import ApiService from './ApiService'
import apiEndpointConfig from '@/configs/api-endpoint.config'

export async function apiGetLocationList<T, U extends Record<string, unknown>>(
    params: U,
) {
    return ApiService.fetchDataWithAxios<T>({
        url: apiEndpointConfig.locations,
        method: 'get',
        params,
    })
}

export async function apiLocation(data: Fields) {
    return ApiService.fetchDataWithAxios<Fields>({
        url: apiEndpointConfig.locations,
        method: 'post',
        data,
    })
}

export async function apiGetLocationById(id: string) {
    return ApiService.fetchDataWithAxios<GetLocationDetailResponse>({
        url: `${apiEndpointConfig.locations}/${id}`,
        method: 'get',
    })
}

export async function apiUpdateLocation(id: string, data: Fields) {
    return ApiService.fetchDataWithAxios<Fields>({
        url: `${apiEndpointConfig.locations}/${id}`,
        method: 'put',
        data,
    })
}
export async function apiGetLabMasterLocation<
    T,
    U extends Record<string, unknown>,
>(params: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: `${apiEndpointConfig.locations}${apiEndpointConfig.syncMaster}`,
        method: 'get',
        params,
    })
}

export async function apiAppendLabLocationToMaster(labLocationId: number) {
    return ApiService.fetchDataWithAxios({
        url: `${apiEndpointConfig.locations}/append-to-master`,
        method: 'post',
        data: {
            location_id: labLocationId,
        },
    })
}

export async function apiGetLabAllLocation(labId: number) {
    return ApiService.fetchDataWithAxios({
        url: `${apiEndpointConfig.locations}/lab-all`,
        method: 'get',
        params: { lab_id: labId },
    })
}
export async function apiAppendMasterLocationToLab(
    masterLocationId: number,
    labId: number,
) {
    return ApiService.fetchDataWithAxios({
        url: `${apiEndpointConfig.locations}/append-to-lab`,
        method: 'post',
        data: {
            master_location_id: masterLocationId,
            lab_id: labId,
        },
    })
}
export async function apiGetPendingLocation() {
    return ApiService.fetchDataWithAxios({
        url: `${apiEndpointConfig.locations}/pending`,
        method: 'get',
    })
}
export async function apiApproveLocation(ids: number[]) {
    return ApiService.fetchDataWithAxios({
        url: `${apiEndpointConfig.locations}/approve`,
        method: 'post',
        data: { ids },
    })
}
