import { MASTER_PREFIX_PATH } from '@/constants/route.constant'

export const apiPrefix = '/api'

const endpointConfig = {
    signIn: '/sign-in',
    signOut: '/sign-out',
    signUp: '/sign-up',
    forgotPassword: '/forgot-password',
    resetPassword: '/reset-password',
    dashbord: '/home',
    master: {
        category: {
            list: `${MASTER_PREFIX_PATH}/category/list`,
            create: `${MASTER_PREFIX_PATH}/category/create`,
            edit: `${MASTER_PREFIX_PATH}/category/edit/:id`,
            view: `${MASTER_PREFIX_PATH}/category/view/:id`,
        },
        department: {
            list: `${MASTER_PREFIX_PATH}/department/list`,
            create: `${MASTER_PREFIX_PATH}/department/create`,
            edit: `${MASTER_PREFIX_PATH}/department/edit/:id`,
            view: `${MASTER_PREFIX_PATH}/department/view/:id`,
        },
        unit: {
            list: `${MASTER_PREFIX_PATH}/unit/list`,
            create: `${MASTER_PREFIX_PATH}/unit/create`,
            edit: `${MASTER_PREFIX_PATH}/unit/edit/:id`,
            view: `${MASTER_PREFIX_PATH}/unit/view/:id`,
        },
        roles: {
            list: `${MASTER_PREFIX_PATH}/roles/list`,
            create: `${MASTER_PREFIX_PATH}/roles/create`,
            edit: `${MASTER_PREFIX_PATH}/roles/edit/:id`,
            view: `${MASTER_PREFIX_PATH}/roles/view/:id`,
        },
        signatoryBy: {
            list: `${MASTER_PREFIX_PATH}/signatoryBy/list`,
            create: `${MASTER_PREFIX_PATH}/signatoryBy/create`,
            edit: `${MASTER_PREFIX_PATH}/signatoryBy/edit/:id`,
            view: `${MASTER_PREFIX_PATH}/signatoryBy/view/:id`,
        },
        signatoryOn: {
            list: `${MASTER_PREFIX_PATH}/signatoryOn/list`,
            create: `${MASTER_PREFIX_PATH}/signatoryOn/create`,
            edit: `${MASTER_PREFIX_PATH}/signatoryOn/edit/:id`,
            view: `${MASTER_PREFIX_PATH}/signatoryOn/view/:id`,
        },

        lab: {
            list: `${MASTER_PREFIX_PATH}/lab/list`,
            create: `${MASTER_PREFIX_PATH}/lab/create`,
            edit: `${MASTER_PREFIX_PATH}/lab/edit/:id`,
            view: `${MASTER_PREFIX_PATH}/lab/view/:id`,
        },
    },
}

export default endpointConfig
