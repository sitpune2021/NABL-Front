import {
    Fields,
    GetPrefixConfigDetailResponse,
    GetPrefixConfigMastersResponse,
    ValidatePrefixConfigValueRequest,
    ValidatePrefixConfigValueResponse,
} from '@/@types/prefixConfig'
import type { PrefixConfigFormSchema } from '@/schemas/prefixConfig.schema'
import ApiService from './ApiService'
import apiEndpointConfig from '@/configs/api-endpoint.config'

type PrefixConfigPayload = Fields | PrefixConfigFormSchema

function normalizePrefixConfigPayload(data: PrefixConfigPayload): Fields {
    const payload = { ...data } as Fields

    return payload
}

export async function apiGetPrefixConfigList<
    T,
    U extends Record<string, unknown>,
>(params: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: apiEndpointConfig.prefixConfig,
        method: 'get',
        params,
    })
}

export async function apiPrefixConfig(data: PrefixConfigPayload) {
    return ApiService.fetchDataWithAxios<GetPrefixConfigDetailResponse>({
        url: apiEndpointConfig.prefixConfig,
        method: 'post',
        data: normalizePrefixConfigPayload(data),
    })
}

export async function apiGetPrefixConfigById(id: string) {
    return ApiService.fetchDataWithAxios<GetPrefixConfigDetailResponse>({
        url: `${apiEndpointConfig.prefixConfig}/${id}`,
        method: 'get',
    })
}

export async function apiUpdatePrefixConfig(
    id: string,
    data: PrefixConfigPayload,
) {
    return ApiService.fetchDataWithAxios<GetPrefixConfigDetailResponse>({
        url: `${apiEndpointConfig.prefixConfig}/${id}`,
        method: 'put',
        data: normalizePrefixConfigPayload(data),
    })
}

export async function apiDeletePrefixConfig(id: string) {
    return ApiService.fetchDataWithAxios({
        url: `${apiEndpointConfig.prefixConfig}/${id}`,
        method: 'delete',
    })
}

export async function apiGetPrefixConfigMasters() {
    return ApiService.fetchDataWithAxios<GetPrefixConfigMastersResponse>({
        url: `${apiEndpointConfig.prefixConfig}/masters`,
        method: 'get',
    })
}

export async function apiValidatePrefixConfigValue(
    data: ValidatePrefixConfigValueRequest,
) {
    return ApiService.fetchDataWithAxios<ValidatePrefixConfigValueResponse>({
        url: `${apiEndpointConfig.prefixConfig}/validate-value`,
        method: 'post',
        data,
    })
}
