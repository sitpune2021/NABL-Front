import { UserFormSchema } from '@/@types/user'

export const USER_EMPTY_VALUES: UserFormSchema = {
    name: '',
    username: '',
    email: '',
    phone: '',
    dialCode: '+91',
    address: '',
    city: '',
    postcode: '',
    profileImage: '',
    signature: '',
    labAssignments: {},
    userRoles: [],
}
