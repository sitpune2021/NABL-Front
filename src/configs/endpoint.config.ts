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
            location: `${MASTER_PREFIX_PATH}/lab/location/:id`,
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
            dataEntry: `${MASTER_PREFIX_PATH}/document/view/:docId/editor/:id/data-entry`,
        },
        template: {
            list: `${MASTER_PREFIX_PATH}/template/list`,
            create: `${MASTER_PREFIX_PATH}/template/create`,
            edit: `${MASTER_PREFIX_PATH}/template/edit/:id`,
            view: `${MASTER_PREFIX_PATH}/template/view/:id`,
        },

        location: {
            list: `${MASTER_PREFIX_PATH}/location/list`,
            create: `${MASTER_PREFIX_PATH}/location/create`,
            edit: `${MASTER_PREFIX_PATH}/location/edit/:id`,
            view: `${MASTER_PREFIX_PATH}/location/view/:id`,
        },

        zone: {
            list: `${MASTER_PREFIX_PATH}/zone/list`,
            create: `${MASTER_PREFIX_PATH}/zone/create`,
            edit: `${MASTER_PREFIX_PATH}/zone/edit/:id`,
            view: `${MASTER_PREFIX_PATH}/zone/view/:id`,
        },

        cluster: {
            list: `${MASTER_PREFIX_PATH}/cluster/list`,
            create: `${MASTER_PREFIX_PATH}/cluster/create`,
            edit: `${MASTER_PREFIX_PATH}/cluster/edit/:id`,
            view: `${MASTER_PREFIX_PATH}/cluster/view/:id`,
        },

        clauses: {
            list: `${MASTER_PREFIX_PATH}/clauses/list`,
            create: `${MASTER_PREFIX_PATH}/clauses/create`,
            edit: `${MASTER_PREFIX_PATH}/clauses/edit/:id`,
            view: `${MASTER_PREFIX_PATH}/clauses/view/:id`,
            standardCreate: `${MASTER_PREFIX_PATH}/clauses/standard/create`,
            standardEdit: `${MASTER_PREFIX_PATH}/clauses/standard/edit/:id`,
            standardView: `${MASTER_PREFIX_PATH}/clauses/standard/view/:id`,
        },
        rolesPermission: {
            list: `${MASTER_PREFIX_PATH}/roles-permission/list`,
        },
        instrument: {
            list: `${MASTER_PREFIX_PATH}/instrument/list`,
            create: `${MASTER_PREFIX_PATH}/instrument/create`,
            edit: `${MASTER_PREFIX_PATH}/instrument/edit/:id`,
            view: `${MASTER_PREFIX_PATH}/instrument/view/:id`,
        },
    },
    setting: {
        config: {
            list: `${MASTER_PREFIX_PATH}/config/list`,
        },
    },
}

export default endpointConfig
