import { Fields, GetClusterDetailResponse } from '@/@types/cluster'
import ApiService from './ApiService'
import apiEndpointConfig from '@/configs/api-endpoint.config'

export async function apiGetClusterList<T, U extends Record<string, unknown>>(
    params: U,
) {
    return ApiService.fetchDataWithAxios<T>({
        url: apiEndpointConfig.clusters,
        method: 'get',
        params,
    })
}

export async function apiCluster(data: Fields) {
    return ApiService.fetchDataWithAxios<Fields>({
        url: apiEndpointConfig.clusters,
        method: 'post',
        data,
    })
}

export async function apiGetClusterById(id: string) {
    return ApiService.fetchDataWithAxios<GetClusterDetailResponse>({
        url: `${apiEndpointConfig.clusters}/${id}`,
        method: 'get',
    })
}

export async function apiUpdateCluster(id: string, data: Fields) {
    return ApiService.fetchDataWithAxios<Fields>({
        url: `${apiEndpointConfig.clusters}/${id}`,
        method: 'put',
        data,
    })
}
export async function apiGetLabMasterCluster<
    T,
    U extends Record<string, unknown>,
>(params: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: `${apiEndpointConfig.clusters}${apiEndpointConfig.syncMaster}`,
        method: 'get',
        params,
    })
}

export async function apiAppendLabClusterToMaster(labClusterId: number) {
    return ApiService.fetchDataWithAxios({
        url: `${apiEndpointConfig.clusters}/append-to-master`,
        method: 'post',
        data: {
            lab_cluster_id: labClusterId,
        },
    })
}

export async function apiGetLabAllCluster(labId: number) {
    return ApiService.fetchDataWithAxios({
        url: `${apiEndpointConfig.clusters}/lab-all`,
        method: 'get',
        params: { lab_id: labId },
    })
}
export async function apiAppendMasterClusterToLab(
    masterClusterId: number,
    labId: number,
) {
    return ApiService.fetchDataWithAxios({
        url: `${apiEndpointConfig.clusters}/append-to-lab`,
        method: 'post',
        data: {
            master_cluster_id: masterClusterId,
            lab_id: labId,
        },
    })
}
export async function apiGetPendingCluster() {
    return ApiService.fetchDataWithAxios({
        url: `${apiEndpointConfig.clusters}/pending`,
        method: 'get',
    })
}
export async function apiApproveCluster(ids: number[]) {
    return ApiService.fetchDataWithAxios({
        url: `${apiEndpointConfig.clusters}/approve`,
        method: 'post',
        data: { ids },
    })
}
