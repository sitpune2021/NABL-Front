import {
    CLIENTS_PREFIX_PATH,
    MASTER_PREFIX_PATH,
    SETTING_PREFIX_PATH,
} from '@/constants/route.constant'

const endpointConfig = {
    signIn: '/sign-in',
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
        subcategory: {
            list: `${MASTER_PREFIX_PATH}/subcategory/list`,
            create: `${MASTER_PREFIX_PATH}/subcategory/create`,
            edit: `${MASTER_PREFIX_PATH}/subcategory/edit/:id`,
            view: `${MASTER_PREFIX_PATH}/subcategory/view/:id`,
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
        document: {
            list: `${MASTER_PREFIX_PATH}/document/list`,
            create: `${MASTER_PREFIX_PATH}/document/create`,
            editor: `${MASTER_PREFIX_PATH}/document/create/editor`,
            editorEdit: `${MASTER_PREFIX_PATH}/document/edit/:id/editor`,
            edit: `${MASTER_PREFIX_PATH}/document/edit/:id`,
            view: `${MASTER_PREFIX_PATH}/document/view/:id`,
            editorview: `${MASTER_PREFIX_PATH}/document/view/:id/editor-view`,
            dataEntry: `${MASTER_PREFIX_PATH}/document/view/:id/data-entry`,
            dataEntryList: `${MASTER_PREFIX_PATH}/document/data-entry/:id`,
        },
        template: {
            list: `${MASTER_PREFIX_PATH}/template/list`,
            create: `${MASTER_PREFIX_PATH}/template/create`,
            edit: `${MASTER_PREFIX_PATH}/template/edit/:id`,
            view: `${MASTER_PREFIX_PATH}/template/view/:id`,
            versions: {
                list: `${MASTER_PREFIX_PATH}/template/:id/versions`,
                edit: `${MASTER_PREFIX_PATH}/template/:id/versions/:version_id`,
                view: `${MASTER_PREFIX_PATH}/template/:id/versions/:version_id`,
            },
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
        instrument: {
            list: `${MASTER_PREFIX_PATH}/instrument/list`,
            create: `${MASTER_PREFIX_PATH}/instrument/create`,
            edit: `${MASTER_PREFIX_PATH}/instrument/edit/:id`,
            view: `${MASTER_PREFIX_PATH}/instrument/view/:id`,
        },
    },
    client: {
        lab: {
            list: `${CLIENTS_PREFIX_PATH}/lab/list`,
            create: `${CLIENTS_PREFIX_PATH}/lab/create`,
            edit: `${CLIENTS_PREFIX_PATH}/lab/edit/:id`,
            location: `${CLIENTS_PREFIX_PATH}/lab/location/:id`,
            view: `${CLIENTS_PREFIX_PATH}/lab/view/:id`,
        },
    },
    setting: {
        rolesPermission: {
            list: `${SETTING_PREFIX_PATH}/roles-permission/list`,
        },
        user: {
            list: `${SETTING_PREFIX_PATH}/user/list`,
            create: `${SETTING_PREFIX_PATH}/user/create`,
            edit: `${SETTING_PREFIX_PATH}/user/edit/:id`,
            view: `${SETTING_PREFIX_PATH}/user/view/:id`,
        },
        clauses: {
            list: `${SETTING_PREFIX_PATH}/clauses/list`,
            create: `${SETTING_PREFIX_PATH}/clauses/create/:id`,
            edit: `${SETTING_PREFIX_PATH}/clauses/edit/:id`,
            view: `${SETTING_PREFIX_PATH}/clauses/view/:id`,
        },
        standard: {
            list: `${SETTING_PREFIX_PATH}/standard/list`,
            create: `${SETTING_PREFIX_PATH}/standard/create`,
            edit: `${SETTING_PREFIX_PATH}/standard/edit/:id`,
            view: `${SETTING_PREFIX_PATH}/standard/view/:id`,
        },
        account: {
            profile: `${SETTING_PREFIX_PATH}/account/profile`,
            security: `${SETTING_PREFIX_PATH}/account/security`,
            notification: `${SETTING_PREFIX_PATH}/account/notification`,
            integration: `${SETTING_PREFIX_PATH}/account/integration`,
        },
    },
}

export default endpointConfig
