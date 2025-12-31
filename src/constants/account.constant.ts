import { ProfileFormSchema } from '@/schemas/account.schema'

export const EMPTY_VALUES: ProfileFormSchema = {
    name: '',
    username: '',
    email: '',
    dialCode: '',
    phone: '',
    address: '',
    profileImage: '',
    userRoles: [],
}

export const LIST_KEY = '/profile/me'
