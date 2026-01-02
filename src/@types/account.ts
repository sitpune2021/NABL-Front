/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Control, FieldErrors } from 'react-hook-form'

export type View = 'profile' | 'security' | 'notification' | 'location'

export type Department = {
    department_id?: number
    roles?: Array<{ value?: number; label?: string }>
}

export type UserRole = {
    id?: string
    zone_id?: number
    cluster_id?: number
    location_id?: number
    department?: Array<Department>
}

export type ProfileFormSchema = {
    id?: string
    name: string
    username: string
    email: string
    phone: string
    dialCode: string
    address?: string
    city?: string
    postcode?: string
    issuedBy: boolean
    approvedBy: boolean
    preparedBy: boolean
    signature?: string
    profileImage?: string
    userRoles?: Array<UserRole>
}

export type ProfileSectionBaseProps = {
    control: Control<ProfileFormSchema>
    errors: FieldErrors<ProfileFormSchema>
    readOnly?: boolean
    setValue?: any
}

export type GetSettingsProfileResponse = {
    data: ProfileFormSchema
}

export type GetSettingsNotificationResponse = {
    email: string[]
    desktop: boolean
    unreadMessageBadge: boolean
    notifymeAbout: string
}
