export type SignInCredential = {
    email: string
    password: string
}

export type SignInResponse = {
    status: AuthRequestStatus
    data: {
        token: string
        user: User
    }
    message: string
}

type Role = {
    id: number
    name: string
    level: number
    description: string
    permissions: string[]
} | null

type LabRoleGroup = {
    lab_id: number
    lab_name: string
    roles: Role[]
} | null

export type RoleResponse = {
    data: {
        roles: LabRoleGroup[]
    }
}

export type SignUpResponse = SignInResponse

export type SignUpCredential = {
    username: string
    email: string
    password: string
}

export type ForgotPassword = {
    email: string
}

export type ResetPassword = {
    password: string
}

export type AuthRequestStatus = 'success' | 'failed' | ''

export type AuthResult = Promise<{
    status: AuthRequestStatus
    message: string
}>

export type User = {
    id?: string
    is_super_admin?: boolean
    name?: string
    username?: string
    email?: string
    authority?: string[]
    signature?: string | null
    lab?: number[] | null
    assignments?: []
}

export type Token = {
    accessToken: string
    refereshToken?: string
}

export type OauthSignInCallbackPayload = {
    onSignIn: (tokens: Token, user: User) => void
    redirect: () => void
}

export type ActionButtonTable = {
    onEdit: () => void
    onViewDetail: () => void
}
