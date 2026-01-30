import { UserSchemaType } from '@/schemas/user.schema'

export const EMPTY_VALUES: UserSchemaType = {
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
    role: '',
    userRoles: [
        {
            zone_id: '',
            cluster_id: '',
            location_id: '',
            department: [
                {
                    department_id: '',
                    roles: [],
                    // permissions: {},
                },
            ],
        },
    ],
}
