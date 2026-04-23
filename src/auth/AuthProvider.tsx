import { useRef, useImperativeHandle, useState, useCallback } from 'react'
import AuthContext from './AuthContext'
import appConfig from '@/configs/app.config'
import { initialState, useSessionUser, useToken } from '@/store/authStore'
import {
    apiGetCurrentProfile,
    apiSignIn,
    apiSignOut,
    apiSignUp,
} from '@/services/AuthService'
import { REDIRECT_URL_KEY } from '@/constants/app.constant'
import { useNavigate } from 'react-router'
import type {
    SignInCredential,
    SignUpCredential,
    AuthResult,
    OauthSignInCallbackPayload,
    User,
    Token,
} from '@/@types/auth'
import type { ReactNode, Ref } from 'react'
import type { NavigateFunction } from 'react-router'

type AuthProviderProps = { children: ReactNode }

export type IsolatedNavigatorRef = {
    navigate: NavigateFunction
}

const IsolatedNavigator = ({ ref }: { ref: Ref<IsolatedNavigatorRef> }) => {
    const navigate = useNavigate()

    useImperativeHandle(ref, () => {
        return { navigate }
    }, [navigate])

    return null
}

function AuthProvider({ children }: AuthProviderProps) {
    const signedIn = useSessionUser((state) => state.session.signedIn)
    const user = useSessionUser((state) => state.user)
    const activeRole = useSessionUser((state) => state.activeRole)
    const setUser = useSessionUser((state) => state.setUser)
    const setRoles = useSessionUser((state) => state.setRoles)
    const setActiveLab = useSessionUser((state) => state.setActiveLab)
    const setActiveRole = useSessionUser((state) => state.setActiveRole)
    const setActiveLocation = useSessionUser((state) => state.setActiveLocation)
    const setActiveDepartment = useSessionUser(
        (state) => state.setActiveDepartment,
    )

    const setSessionSignedIn = useSessionUser(
        (state) => state.setSessionSignedIn,
    )
    const { token, setToken } = useToken()
    const [tokenState, setTokenState] = useState(token)
    const [authLoading, setAuthLoading] = useState(false)

    const authenticated = Boolean(tokenState && signedIn)

    const navigatorRef = useRef<IsolatedNavigatorRef>(null)

    const redirect = () => {
        const search = window.location.search
        const params = new URLSearchParams(search)
        const redirectUrl = params.get(REDIRECT_URL_KEY)

        navigatorRef.current?.navigate(
            redirectUrl ? redirectUrl : appConfig.authenticatedEntryPath,
        )
    }

    const can = useCallback(
        (permission: string): boolean => {
            if (!activeRole) return false

            if (activeRole.name === 'super_admin') return true

            return activeRole.permissions?.includes(permission)
        },
        [activeRole],
    )

    const hasRole = useCallback(
        (roleName: string): boolean => {
            return activeRole?.name === roleName
        },
        [activeRole],
    )

    const handleSignIn = (tokens: Token, user?: User) => {
        setToken(tokens.accessToken)
        setTokenState(tokens.accessToken)
        setSessionSignedIn(true)

        if (user) {
            setUser(user)
        }
    }

    const handleSignOut = () => {
        setToken('')
        setUser(initialState.user)
        setSessionSignedIn(false)
        setRoles([])
        setActiveLab(null)
        setActiveRole(null)
        setActiveLocation(null)
        setActiveDepartment(null)
    }

    const signIn = async (values: SignInCredential): Promise<AuthResult> => {
        try {
            setAuthLoading(true)

            const resp = await apiSignIn(values)
            if (resp) {
                handleSignIn({ accessToken: resp.data.token }, resp.data.user)

                setRoles([])
                setActiveLab(null)
                setActiveRole(null)
                setActiveLocation(null)
                setActiveDepartment(null)

                const profileResp = await apiGetCurrentProfile()
                if (profileResp?.data?.roles?.length > 0) {
                    const labs = profileResp.data.roles
                    setRoles(labs)
                    const firstLab = labs[0]
                    setActiveLab(firstLab)
                    if (firstLab) {
                        setActiveRole(firstLab.roles[0])
                        if (firstLab.lab_id != 0) {
                            setActiveLocation(firstLab.locations[0])
                            if (firstLab.locations[0].departments.length > 0) {
                                setActiveDepartment(
                                    firstLab.locations[0].departments[0],
                                )
                            }
                        }
                    }
                }

                redirect()
                return {
                    status: resp.status,
                    message: resp.message,
                }
            }
            return {
                status: 'failed',
                message: 'Unable to sign in',
            }
            // eslint-disable-next-line  @typescript-eslint/no-explicit-any
        } catch (errors: any) {
            return {
                status: 'failed',
                message: errors?.response?.data?.message || errors.toString(),
            }
        } finally {
            setAuthLoading(false)
        }
    }

    const signUp = async (values: SignUpCredential): Promise<AuthResult> => {
        try {
            const resp = await apiSignUp(values)

            if (resp) {
                handleSignIn({ accessToken: resp.data.token }, resp.data.user)
                redirect()

                return {
                    status: resp.status,
                    message: resp.message,
                }
            }

            return {
                status: 'failed',
                message: 'Unable to sign up',
            }
            // eslint-disable-next-line  @typescript-eslint/no-explicit-any
        } catch (errors: any) {
            return {
                status: 'failed',
                message: errors?.response?.data?.message || errors.toString(),
            }
        }
    }

    const signOut = async () => {
        try {
            await apiSignOut()
        } finally {
            handleSignOut()
            navigatorRef.current?.navigate('/')
        }
    }

    const oAuthSignIn = (
        callback: (payload: OauthSignInCallbackPayload) => void,
    ) => {
        callback({
            onSignIn: handleSignIn,
            redirect,
        })
    }

    return (
        <AuthContext.Provider
            value={{
                authenticated,
                user,
                signIn,
                signUp,
                signOut,
                oAuthSignIn,
                can,
                hasRole,
                authLoading,
            }}
        >
            {children}
            <IsolatedNavigator ref={navigatorRef} />
        </AuthContext.Provider>
    )
}

export default AuthProvider
