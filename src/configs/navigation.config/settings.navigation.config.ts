import {
    NAV_ITEM_TYPE_TITLE,
    NAV_ITEM_TYPE_ITEM,
} from '@/constants/navigation.constant'
import type { NavigationTree } from '@/@types/navigation'
import endpointConfig from '../endpoint.config'

const settingNavigationConfig: NavigationTree[] = [
    {
        key: 'settings',
        path: '',
        title: 'Settings',
        translateKey: 'nav.settings',
        icon: 'concepts',
        type: NAV_ITEM_TYPE_TITLE,
        authority: [],
        meta: {},
        subMenu: [
            {
                key: 'settings.unit.list',
                path: `${endpointConfig.setting.unit.list}`,
                title: 'Unit',
                translateKey: 'nav.settingsUnit.list',
                icon: 'uiFormsSelect',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                meta: {
                    description: {
                        translateKey: 'nav.settingsUnit.listDesc',
                        label: 'AI-powered chat systems',
                    },
                },
                subMenu: [],
            },
            {
                key: 'settings.rolesPermission.list',
                path: `${endpointConfig.setting.rolesPermission.list}`,
                title: 'Roles & Permission',
                translateKey: 'nav.settingsRoles.list',
                icon: 'accountRoleAndPermission',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                meta: {
                    description: {
                        translateKey: 'nav.settingsRoles.listDesc',
                        label: 'AI-powered chat systems',
                    },
                },
                subMenu: [],
            },
            {
                key: 'settings.user.list',
                path: `${endpointConfig.setting.user.list}`,
                title: 'User',
                translateKey: 'nav.settingsUser.list',
                icon: 'account',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                meta: {
                    description: {
                        translateKey: 'nav.settingsUser.listDesc',
                        label: 'AI-powered chat systems',
                    },
                },
                subMenu: [],
            },
            {
                key: 'settings.clauses.list',
                path: `${endpointConfig.setting.clauses.list}`,
                title: 'Standards',
                translateKey: 'nav.settingsClauses.list',
                icon: 'helpCeterEditArticle',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                meta: {
                    description: {
                        translateKey: 'nav.settingsClauses.listDesc',
                        label: 'AI-powered chat systems',
                    },
                },
                subMenu: [],
            },
            {
                key: 'settings.config.list',
                path: `${endpointConfig.setting.config.list}`,
                title: 'Standards',
                translateKey: 'nav.settingconfig.list',
                icon: 'helpCeterEditArticle',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                meta: {
                    description: {
                        translateKey: 'nav.settingConfig.listDesc',
                        label: 'AI-powered chat systems',
                    },
                },
                subMenu: [],
            },
        ],
    },
]

export default settingNavigationConfig
