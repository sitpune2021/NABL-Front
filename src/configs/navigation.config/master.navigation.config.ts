import {
    NAV_ITEM_TYPE_TITLE,
    NAV_ITEM_TYPE_COLLAPSE,
    NAV_ITEM_TYPE_ITEM,
} from '@/constants/navigation.constant'
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
                key: 'masters.category.list',
                path: `${endpointConfig.master.category.list}`,
                title: 'Category',
                translateKey: 'nav.mastersCategory.list',
                icon: 'documentation',
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
            {
                key: 'masters.subcategory.list',
                path: `${endpointConfig.master.subcategory.list}`,
                title: 'Sub Category',
                translateKey: 'nav.mastersSubCategory.list',
                icon: 'products',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                meta: {
                    description: {
                        translateKey: 'nav.mastersSubCategory.listDesc',
                        label: 'AI-powered chat systems',
                    },
                },
                subMenu: [],
            },
            {
                key: 'masters.department.list',
                path: `${endpointConfig.master.department.list}`,
                title: 'Department',
                translateKey: 'nav.mastersDepartment.list',
                icon: 'utilsDoc',
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
            {
                key: 'masters.template.list',
                path: `${endpointConfig.master.template.list}`,
                title: 'Template',
                translateKey: 'nav.mastersTemplate.list',
                icon: 'uiComponents',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                meta: {
                    description: {
                        translateKey: 'nav.mastersTemplate.listDesc',
                        label: 'AI-powered chat systems',
                    },
                },
                subMenu: [],
            },
            {
                key: 'masters.document.list',
                path: `${endpointConfig.master.document.list}`,
                title: 'Document',
                translateKey: 'nav.mastersDocument.list',
                icon: 'dataDisplay',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                meta: {
                    description: {
                        translateKey: 'nav.mastersDocument.listDesc',
                        label: 'AI-powered chat systems',
                    },
                },
                subMenu: [],
            },
            {
                key: 'masters.lab.list',
                path: `${endpointConfig.master.lab.list}`,
                title: 'Lab',
                translateKey: 'nav.mastersLab.list',
                icon: 'sharedComponentDoc',
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
            {
                key: 'masters.zone.list',
                path: `${endpointConfig.master.zone.list}`,
                title: 'Zone',
                translateKey: 'nav.mastersZone.list',
                icon: 'navigation',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                meta: {
                    description: {
                        translateKey: 'nav.mastersZone.listDesc',
                        label: 'AI-powered chat systems',
                    },
                },
                subMenu: [],
            },
            {
                key: 'masters.cluster.list',
                path: `${endpointConfig.master.cluster.list}`,
                title: 'Cluster',
                translateKey: 'nav.mastersCluster.list',
                icon: 'fileManager',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                meta: {
                    description: {
                        translateKey: 'nav.mastersCluster.listDesc',
                        label: 'AI-powered chat systems',
                    },
                },
                subMenu: [],
            },
            {
                key: 'masters.location.list',
                path: `${endpointConfig.master.location.list}`,
                title: 'Location',
                translateKey: 'nav.mastersLocation.list',
                icon: 'uiGraphMaps',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                meta: {
                    description: {
                        translateKey: 'nav.mastersLocation.listDesc',
                        label: 'AI-powered chat systems',
                    },
                },
                subMenu: [],
            },
            {
                key: 'masters.instrument.list',
                path: `${endpointConfig.master.instrument.list}`,
                title: 'Instrument',
                translateKey: 'nav.mastersInstrument.list',
                icon: 'documentation',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                meta: {
                    description: {
                        translateKey: 'nav.mastersInstrument.listDesc',
                        label: 'AI-powered chat systems',
                    },
                },
                subMenu: [],
            },
        ],
    },
    {
        key: 'settings',
        path: '',
        title: 'Settings',
        translateKey: 'nav.masters',
        icon: 'concepts',
        type: NAV_ITEM_TYPE_TITLE,
        authority: [],
        meta: {},
        subMenu: [
            {
                key: 'masters.unit.list',
                path: `${endpointConfig.master.unit.list}`,
                title: 'Unit',
                translateKey: 'nav.mastersUnit.list',
                icon: 'uiFormsSelect',
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
            {
                key: 'masters.rolesPermission.list',
                path: `${endpointConfig.master.rolesPermission.list}`,
                title: 'Roles & Permission',
                translateKey: 'nav.mastersRoles.list',
                icon: 'accountRoleAndPermission',
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
            {
                key: 'masters.user.list',
                path: `${endpointConfig.master.user.list}`,
                title: 'User',
                translateKey: 'nav.mastersUser.list',
                icon: 'account',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                meta: {
                    description: {
                        translateKey: 'nav.mastersUser.listDesc',
                        label: 'AI-powered chat systems',
                    },
                },
                subMenu: [],
            },
            {
                key: 'masters.clauses.list',
                path: `${endpointConfig.master.clauses.list}`,
                title: 'Standards',
                translateKey: 'nav.mastersClauses.list',
                icon: 'helpCeterEditArticle',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                meta: {
                    description: {
                        translateKey: 'nav.mastersClauses.listDesc',
                        label: 'AI-powered chat systems',
                    },
                },
                subMenu: [],
            },
        ],
    },
    {
        key: 'extra',
        path: '',
        title: 'Extra Settings',
        translateKey: 'nav.masters',
        icon: 'concepts',
        type: NAV_ITEM_TYPE_TITLE,
        authority: [],
        meta: {},
        subMenu: [
            {
                key: 'masters.signatoryBy',
                path: '',
                title: 'Signatory',
                translateKey: 'nav.mastersSignatoryBy.signatoryBy',
                icon: 'common',
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
                        title: 'By',
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
                    {
                        key: 'masters.signatoryOn.list',
                        path: `${endpointConfig.master.signatoryOn.list}`,
                        title: 'On',
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
        ],
    },
]

export default masterNavigationConfig
