import {
    NAV_ITEM_TYPE_TITLE,
    NAV_ITEM_TYPE_ITEM,
    NAV_ITEM_TYPE_COLLAPSE,
} from '@/constants/navigation.constant'

import type { NavigationTree } from '@/@types/navigation'

const navigationConfig: NavigationTree[] = [
    {
        key: 'home',
        path: '/home',
        title: 'Home',
        translateKey: 'nav.home',
        icon: 'home',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [],
        subMenu: [],
    },
    {
        key: 'master',
        path: '',
        title: 'Master',
        translateKey: 'nav.master',
        icon: 'master',
        type: NAV_ITEM_TYPE_TITLE,
        authority: [], // Add authority as per your access control
        meta: {
            horizontalMenu: {
                layout: 'columns',
                columns: 4,
            },
        },
        subMenu: [
            {
                key: 'master.template',
                path: '',
                title: 'Template',
                translateKey: 'nav.masterTemplate.template',
                icon: 'common',
                type: NAV_ITEM_TYPE_COLLAPSE,
                authority: [],
                meta: {
                    description: {
                        translateKey: 'nav.masterTemplate.templateDesc',
                        label: 'Template management',
                    },
                },
                subMenu: [
                    {
                        key: 'master.template.list',
                        path: `/master/template`,
                        title: 'Template List',
                        translateKey: 'nav.masterTemplate.list',
                        icon: 'templateList',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [],
                        meta: {
                            description: {
                                translateKey: 'nav.masterTemplate.listDesc',
                                label: 'List of all templates',
                            },
                        },
                        subMenu: [],
                    },
                    {
                        key: 'master.template.create',
                        path: `/master/template/template-create`,
                        title: 'Create Template',
                        translateKey: 'nav.masterTemplate.create',
                        icon: 'templateCreate',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [],
                        meta: {
                            description: {
                                translateKey: 'nav.masterTemplate.createDesc',
                                label: 'Add a new template',
                            },
                        },
                        subMenu: [],
                    },
                ],
            },
        ],
    },
]

export default navigationConfig
