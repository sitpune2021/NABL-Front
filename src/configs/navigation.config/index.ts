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
        subMenu: [
            {
                key: 'master.template',
                path: '',
                title: 'Template',
                translateKey: 'nav.master.template',
                icon: 'common',
                type: NAV_ITEM_TYPE_COLLAPSE,
                authority: [],
                subMenu: [
                    {
                        key: 'master.template.list',
                        path: `/master/template`,
                        title: 'Template List',
                        translateKey: 'nav.masterTemplate.list',
                        icon: 'templateList',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [],
                        subMenu: [],
                    },
                ],
            },
            {
                key: 'master.category',
                path: '',
                title: 'category',
                translateKey: 'nav.masterCategory.category',
                icon: 'common',
                type: NAV_ITEM_TYPE_COLLAPSE,
                authority: [],
                subMenu: [
                    {
                        key: 'master.category.list',
                        path: `/master/category`,
                        title: 'Category List',
                        translateKey: 'nav.masterCategory.list',
                        icon: 'templateList',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [],
                        subMenu: [],
                    },
                    // {
                    //     key: 'master.category.create',
                    //     path: `/master/category/category-create`,
                    //     title: 'Create Category',
                    //     translateKey: 'nav.masterCategory.create',
                    //     icon: 'templateCreate',
                    //     type: NAV_ITEM_TYPE_ITEM,
                    //     authority: [],
                    //     subMenu: [],
                    // },
                ],
            },
        ],
    },
]

export default navigationConfig
