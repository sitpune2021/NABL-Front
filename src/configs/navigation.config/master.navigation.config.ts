import { MASTER_PREFIX_PATH } from '@/constants/route.constant'
import {
    NAV_ITEM_TYPE_TITLE,
    NAV_ITEM_TYPE_COLLAPSE,
    NAV_ITEM_TYPE_ITEM,
} from '@/constants/navigation.constant'
import {} from '@/constants/roles.constant'
import type { NavigationTree } from '@/@types/navigation'

const masterNavigationConfig: NavigationTree[] = [
    {
        key: 'masters',
        path: '',
        title: 'Masters',
        translateKey: 'nav.masters',
        icon: 'concepts',
        type: NAV_ITEM_TYPE_TITLE,
        authority: [],
        meta: {},
        subMenu: [
            {
                key: 'masters.templates',
                path: '',
                title: 'Template',
                translateKey: 'nav.mastersTemplates.templates',
                icon: 'ai',
                type: NAV_ITEM_TYPE_COLLAPSE,
                authority: [],
                meta: {
                    description: {
                        translateKey: 'nav.mastersTemplates.templatesDesc',
                        label: 'AI tools and resources',
                    },
                },
                subMenu: [
                    {
                        key: 'masters.templates.list',
                        path: `${MASTER_PREFIX_PATH}/templates/list`,
                        title: 'List',
                        translateKey: 'nav.mastersTemplates.list',
                        icon: 'aiChat',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [],
                        meta: {
                            description: {
                                translateKey: 'nav.mastersTemplates.listDesc',
                                label: 'AI-powered chat systems',
                            },
                        },
                        subMenu: [],
                    },
                ],
            },
            {
                key: 'masters.category',
                path: '',
                title: 'Category',
                translateKey: 'nav.mastersCategory.category',
                icon: 'ai',
                type: NAV_ITEM_TYPE_COLLAPSE,
                authority: [],
                meta: {
                    description: {
                        translateKey: 'nav.mastersCategory.categoryDesc',
                        label: 'AI tools and resources',
                    },
                },
                subMenu: [
                    {
                        key: 'masters.category.list',
                        path: `${MASTER_PREFIX_PATH}/category/list`,
                        title: 'List',
                        translateKey: 'nav.mastersCategory.list',
                        icon: 'aiChat',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [],
                        meta: {
                            description: {
                                translateKey: 'nav.mastersCategory.listDesc',
                                label: 'AI-powered chat systems',
                            },
                        },
                        subMenu: [],
                    },
                ],
            },
        ],
    },
]

export default masterNavigationConfig
