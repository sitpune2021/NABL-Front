import { createContext } from 'react'
import type {
    SignInCredential,
    SignUpCredential,
    AuthResult,
    User,
    OauthSignInCallbackPayload,
} from '@/@types/auth'

type Auth = {
    authenticated: boolean
    user: User | null
    signIn: (values: SignInCredential) => Promise<AuthResult>
    signUp: (values: SignUpCredential) => Promise<AuthResult>
    signOut: () => void
    oAuthSignIn: (
        callback: (payload: OauthSignInCallbackPayload) => void,
    ) => void

    can: (permission: string) => boolean
    hasRole: (role: string) => boolean
    authLoading: boolean
}

const defaultFunctionPlaceHolder = async (): Promise<AuthResult> => {
    return {
        status: '',
        message: '',
    }
}

const defaultOAuthSignInPlaceHolder = (
    callback: (payload: OauthSignInCallbackPayload) => void,
): void => {
    callback({
        onSignIn: () => {},
        redirect: () => {},
    })
}

const AuthContext = createContext<Auth>({
    authenticated: false,
    user: null,
    signIn: defaultFunctionPlaceHolder,
    signUp: defaultFunctionPlaceHolder,
    signOut: () => {},
    oAuthSignIn: defaultOAuthSignInPlaceHolder,

    can: () => false,
    hasRole: () => false,
    authLoading: false,
})

export default AuthContext
