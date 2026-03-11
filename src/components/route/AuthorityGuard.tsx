/* eslint-disable @typescript-eslint/no-explicit-any */
import { PropsWithChildren } from 'react'
import { Navigate } from 'react-router'
import useAuth from '@/auth/useAuth'

type AuthorityGuardProps = PropsWithChildren<{
    authority?: string[]
    permission: any
}>
const AuthorityGuard = (props: AuthorityGuardProps) => {
    const { permission, children } = props
    const { can, authLoading } = useAuth()

    if (authLoading) {
        return null
    }

    if (permission) {
        if (!can(permission)) {
            return <Navigate to="/access-denied" />
        }
    }

    return <>{children}</>
}

export default AuthorityGuard
