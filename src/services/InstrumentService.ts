import { Fields, GetInstrumentDetailResponse } from '@/@types/instrument'
import ApiService from './ApiService'
import apiEndpointConfig from '@/configs/api-endpoint.config'

export async function apiGetInstrumentList<
    T,
    U extends Record<string, unknown>,
>(params: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: apiEndpointConfig.instruments,
        method: 'get',
        params,
    })
}

export async function apiInstrument(data: Fields) {
    return ApiService.fetchDataWithAxios<GetInstrumentDetailResponse>({
        url: apiEndpointConfig.instruments,
        method: 'post',
        data,
    })
}

export async function apiGetInstrumentById(id: string) {
    return ApiService.fetchDataWithAxios<GetInstrumentDetailResponse>({
        url: `${apiEndpointConfig.instruments}/${id}`,
        method: 'get',
    })
}

export async function apiUpdateInstrument(id: string, data: Fields) {
    return ApiService.fetchDataWithAxios<GetInstrumentDetailResponse>({
        url: `${apiEndpointConfig.instruments}/${id}`,
        method: 'put',
        data,
    })
}

export async function apiGetLabMasterInstrument<
    T,
    U extends Record<string, unknown>,
>(params: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: `${apiEndpointConfig.instruments}${apiEndpointConfig.syncMaster}`,
        method: 'get',
        params,
    })
}

export async function apiAppendLabInstrumentToMaster(labInstrumentId: number) {
    return ApiService.fetchDataWithAxios({
        url: `${apiEndpointConfig.instruments}/append-to-master`,
        method: 'post',
        data: {
            lab_zone_id: labInstrumentId,
        },
    })
}

export async function apiGetLabAllInstrument(labId: number) {
    return ApiService.fetchDataWithAxios({
        url: `${apiEndpointConfig.instruments}/lab-all`,
        method: 'get',
        params: { lab_id: labId },
    })
}
export async function apiAppendMasterInstrumentToLab(
    masterInstrumentId: number,
    labId: number,
) {
    return ApiService.fetchDataWithAxios({
        url: `${apiEndpointConfig.instruments}/append-to-lab`,
        method: 'post',
        data: {
            master_zone_id: masterInstrumentId,
            lab_id: labId,
        },
    })
}
export async function apiGetPendingInstrument() {
    return ApiService.fetchDataWithAxios({
        url: `${apiEndpointConfig.instruments}/pending`,
        method: 'get',
    })
}
export async function apiApproveInstrument(ids: number[]) {
    return ApiService.fetchDataWithAxios({
        url: `${apiEndpointConfig.instruments}/approve`,
        method: 'post',
        data: { ids },
    })
}
