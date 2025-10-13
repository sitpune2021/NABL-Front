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

        user: {
            list: `${MASTER_PREFIX_PATH}/user/list`,
            create: `${MASTER_PREFIX_PATH}/user/create`,
            edit: `${MASTER_PREFIX_PATH}/user/edit/:id`,
            view: `${MASTER_PREFIX_PATH}/user/view/:id`,
        },
        subcategory: {
            list: `${MASTER_PREFIX_PATH}/subcategory/list`,
            create: `${MASTER_PREFIX_PATH}/subcategory/create`,
            edit: `${MASTER_PREFIX_PATH}/subcategory/edit/:id`,
            view: `${MASTER_PREFIX_PATH}/subcategory/view/:id`,
        },
        document: {
            list: `${MASTER_PREFIX_PATH}/document/list`,
            create: `${MASTER_PREFIX_PATH}/document/create`,
            editor: `${MASTER_PREFIX_PATH}/document/create/editor`,
            editorEdit: `${MASTER_PREFIX_PATH}/document/edit/:docId/editor/:id`,
            edit: `${MASTER_PREFIX_PATH}/document/edit/:id`,
            view: `${MASTER_PREFIX_PATH}/document/view/:id`,
            editorview: `${MASTER_PREFIX_PATH}/document/view/:docId/editor/:id`,
        },
        template: {
            list: `${MASTER_PREFIX_PATH}/template/list`,
            create: `${MASTER_PREFIX_PATH}/template/create`,
            edit: `${MASTER_PREFIX_PATH}/template/edit/:id`,
            view: `${MASTER_PREFIX_PATH}/template/view/:id`,
        },
        rolesPermission: {
            list: `${MASTER_PREFIX_PATH}/roles-permission/list`,
        },
    },
}

export default endpointConfig
