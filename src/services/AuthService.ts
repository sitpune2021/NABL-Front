import ApiService from './ApiService'
import apiEndpointConfig from '@/configs/api-endpoint.config'
import type {
    SignInCredential,
    SignUpCredential,
    ForgotPassword,
    ResetPassword,
    SignInResponse,
    SignUpResponse,
} from '@/@types/auth'

export async function apiSignIn(data: SignInCredential) {
    return ApiService.fetchDataWithAxios<SignInResponse>({
        url: apiEndpointConfig.signIn,
        method: 'post',
        data,
    })
}

export async function apiSignUp(data: SignUpCredential) {
    return ApiService.fetchDataWithAxios<SignUpResponse>({
        url: apiEndpointConfig.signUp,
        method: 'post',
        data,
    })
}

export async function apiSignOut() {
    return ApiService.fetchDataWithAxios({
        url: apiEndpointConfig.signOut,
        method: 'post',
    })
}

export async function apiForgotPassword<T>(data: ForgotPassword) {
    return ApiService.fetchDataWithAxios<T>({
        url: apiEndpointConfig.forgotPassword,
        method: 'post',
        data,
    })
}

export async function apiResetPassword<T>(data: ResetPassword) {
    return ApiService.fetchDataWithAxios<T>({
        url: apiEndpointConfig.resetPassword,
        method: 'post',
        data,
    })
}
