import cookiesStorage from '@/utils/cookiesStorage'
import appConfig from '@/configs/app.config'
import { TOKEN_NAME_IN_STORAGE } from '@/constants/api.constant'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { User } from '@/@types/auth'

type Session = {
    signedIn: boolean
}

type Role = {
    id: number
    name: string
    level: number
    description: string
} | null

type LabRoleGroup = {
    lab_id: number
    lab_name: string
    roles: Role[]
} | null

type AuthState = {
    session: Session
    user: User
    roles: LabRoleGroup[] // 👈 changed
    activeLab?: LabRoleGroup | null
    activeRole?: Role | null
}

type AuthAction = {
    setSessionSignedIn: (payload: boolean) => void
    setUser: (payload: User) => void
    setRoles: (payload: LabRoleGroup[]) => void
    setActiveLab: (payload: LabRoleGroup) => void
    setActiveRole: (payload: Role) => void
}

const getPersistStorage = () => {
    if (appConfig.accessTokenPersistStrategy === 'localStorage') {
        return localStorage
    }

    if (appConfig.accessTokenPersistStrategy === 'sessionStorage') {
        return sessionStorage
    }

    return cookiesStorage
}

export const initialState: AuthState = {
    session: {
        signedIn: false,
    },
    user: {
        id: '',
        is_super_admin: false,
        name: '',
        username: '',
        email: '',
        authority: [],
        signature: null,
        lab: null,
        assignments: [],
    },
    roles: [],
}

export const useSessionUser = create<AuthState & AuthAction>()(
    persist(
        (set) => ({
            ...initialState,
            setSessionSignedIn: (payload) =>
                set((state) => ({
                    session: {
                        ...state.session,
                        signedIn: payload,
                    },
                })),
            setUser: (payload) =>
                set((state) => ({
                    user: {
                        ...state.user,
                        ...payload,
                    },
                })),
            setRoles: (payload) =>
                set(() => ({
                    roles: payload,
                })),

            setActiveLab: (payload) =>
                set(() => ({
                    activeLab: payload,
                })),

            setActiveRole: (payload) =>
                set(() => ({
                    activeRole: payload,
                })),
        }),
        { name: 'sessionUser', storage: createJSONStorage(() => localStorage) },
    ),
)

export const useToken = () => {
    const storage = getPersistStorage()

    const setToken = (token: string) => {
        storage.setItem(TOKEN_NAME_IN_STORAGE, token)
    }

    return {
        setToken,
        token: storage.getItem(TOKEN_NAME_IN_STORAGE),
    }
}
