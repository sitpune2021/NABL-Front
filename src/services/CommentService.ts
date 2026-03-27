/* eslint-disable @typescript-eslint/no-explicit-any */
import ApiService from './ApiService'

export const getComments = (documentId: string | number) =>
    ApiService.fetchDataWithAxios({
        url: `/comments/${documentId}`,
        method: 'get',
    })

export const addComment = (data: any) =>
    ApiService.fetchDataWithAxios({
        url: `/comments`,
        method: 'post',
        data,
    })
