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
                key: 'settings.standard.list',
                path: `${endpointConfig.setting.standard.list}`,
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
        ],
    },
]

export default settingNavigationConfig
