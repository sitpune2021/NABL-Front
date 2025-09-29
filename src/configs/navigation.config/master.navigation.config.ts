import {
    NAV_ITEM_TYPE_TITLE,
    NAV_ITEM_TYPE_COLLAPSE,
    NAV_ITEM_TYPE_ITEM,
} from '@/constants/navigation.constant'
import {} from '@/constants/roles.constant'
import type { NavigationTree } from '@/@types/navigation'
import endpointConfig from '../endpoint.config'

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
                        path: `${endpointConfig.master.category.list}`,
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
            {
                key: 'masters.department',
                path: '',
                title: 'Department',
                translateKey: 'nav.mastersDepartment.department',
                icon: 'ai',
                type: NAV_ITEM_TYPE_COLLAPSE,
                authority: [],
                meta: {
                    description: {
                        translateKey: 'nav.mastersDepartment.departmentDesc',
                        label: 'AI tools and resources',
                    },
                },
                subMenu: [
                    {
                        key: 'masters.department.list',
                        path: `${endpointConfig.master.department.list}`,
                        title: 'List',
                        translateKey: 'nav.mastersDepartment.list',
                        icon: 'aiChat',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [],
                        meta: {
                            description: {
                                translateKey: 'nav.mastersDepartment.listDesc',
                                label: 'AI-powered chat systems',
                            },
                        },
                        subMenu: [],
                    },
                ],
            },

            {
                key: 'masters.unit',
                path: '',
                title: 'Unit',
                translateKey: 'nav.mastersUnit.unit',
                icon: 'ai',
                type: NAV_ITEM_TYPE_COLLAPSE,
                authority: [],
                meta: {
                    description: {
                        translateKey: 'nav.mastersUnit.unitDesc',
                        label: 'AI tools and resources',
                    },
                },
                subMenu: [
                    {
                        key: 'masters.unit.list',
                        path: `${endpointConfig.master.unit.list}`,
                        title: 'List',
                        translateKey: 'nav.mastersUnit.list',
                        icon: 'aiChat',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [],
                        meta: {
                            description: {
                                translateKey: 'nav.mastersUnit.listDesc',
                                label: 'AI-powered chat systems',
                            },
                        },
                        subMenu: [],
                    },
                ],
            },

            {
                key: 'masters.roles',
                path: '',
                title: 'Roles',
                translateKey: 'nav.mastersRoles.roles',
                icon: 'ai',
                type: NAV_ITEM_TYPE_COLLAPSE,
                authority: [],
                meta: {
                    description: {
                        translateKey: 'nav.mastersRoles.rolesDesc',
                        label: 'AI tools and resources',
                    },
                },
                subMenu: [
                    {
                        key: 'masters.roles.list',
                        path: `${endpointConfig.master.roles.list}`,
                        title: 'List',
                        translateKey: 'nav.mastersRoles.list',
                        icon: 'aiChat',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [],
                        meta: {
                            description: {
                                translateKey: 'nav.mastersRoles.listDesc',
                                label: 'AI-powered chat systems',
                            },
                        },
                        subMenu: [],
                    },
                ],
            },
            {
                key: 'masters.signatoryBy',
                path: '',
                title: 'SignatoryBy',
                translateKey: 'nav.mastersSignatoryBy.signatoryBy',
                icon: 'ai',
                type: NAV_ITEM_TYPE_COLLAPSE,
                authority: [],
                meta: {
                    description: {
                        translateKey: 'nav.mastersSignatoryBy.signatoryByDesc',
                        label: 'AI tools and resources',
                    },
                },
                subMenu: [
                    {
                        key: 'masters.signatoryBy.list',
                        path: `${endpointConfig.master.signatoryBy.list}`,
                        title: 'List',
                        translateKey: 'nav.mastersSignatoryBy.list',
                        icon: 'aiChat',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [],
                        meta: {
                            description: {
                                translateKey: 'nav.mastersSignatoryBy.listDesc',
                                label: 'AI-powered chat systems',
                            },
                        },
                        subMenu: [],
                    },
                ],
            },

            {
                key: 'masters.signatoryOn',
                path: '',
                title: 'SignatoryOn',
                translateKey: 'nav.mastersSignatoryOn.signatoryOn',
                icon: 'ai',
                type: NAV_ITEM_TYPE_COLLAPSE,
                authority: [],
                meta: {
                    description: {
                        translateKey: 'nav.mastersSignatoryOn.signatoryOnDesc',
                        label: 'AI tools and resources',
                    },
                },
                subMenu: [
                    {
                        key: 'masters.signatoryOn.list',
                        path: `${endpointConfig.master.signatoryOn.list}`,
                        title: 'List',
                        translateKey: 'nav.mastersSignatoryOn.list',
                        icon: 'aiChat',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [],
                        meta: {
                            description: {
                                translateKey: 'nav.mastersSignatoryOn.listDesc',
                                label: 'AI-powered chat systems',
                            },
                        },
                        subMenu: [],
                    },
                ],
            },

            {
                key: 'masters.lab',
                path: '',
                title: 'Lab',
                translateKey: 'nav.mastersLab.lab',
                icon: 'ai',
                type: NAV_ITEM_TYPE_COLLAPSE,
                authority: [],
                meta: {
                    description: {
                        translateKey: 'nav.mastersLab.labDesc',
                        label: 'AI tools and resources',
                    },
                },
                subMenu: [
                    {
                        key: 'masters.lab.list',
                        path: `${endpointConfig.master.lab.list}`,
                        title: 'List',
                        translateKey: 'nav.mastersLab.list',
                        icon: 'aiChat',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [],
                        meta: {
                            description: {
                                translateKey: 'nav.mastersLab.listDesc',
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
