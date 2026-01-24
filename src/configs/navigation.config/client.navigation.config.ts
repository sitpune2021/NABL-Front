import {
    NAV_ITEM_TYPE_TITLE,
    NAV_ITEM_TYPE_ITEM,
} from '@/constants/navigation.constant'
import type { NavigationTree } from '@/@types/navigation'
import endpointConfig from '../endpoint.config'

const clientNavigationConfig: NavigationTree[] = [
    {
        key: 'clients',
        path: '',
        title: 'Clients',
        translateKey: 'nav.clients',
        icon: 'concepts',
        type: NAV_ITEM_TYPE_TITLE,
        for: 'master',
        authority: [],
        meta: {},
        subMenu: [
            {
                key: 'clients.lab.list',
                path: `${endpointConfig.client.lab.list}`,
                title: 'Lab',
                translateKey: 'nav.clientsLab.list',
                icon: 'sharedComponentDoc',
                type: NAV_ITEM_TYPE_ITEM,
                for: 'master',
                authority: [],
                meta: {
                    description: {
                        translateKey: 'nav.clientsLab.listDesc',
                        label: 'AI-powered chat systems',
                    },
                },
                subMenu: [],
            },
            {
                key: 'clients.lab.assignments.list',
                path: `${endpointConfig.client.labAssignment.list}`,
                title: 'Lab Assignments',
                translateKey: 'nav.clientsLab.list',
                icon: 'sharedComponentDoc',
                type: NAV_ITEM_TYPE_ITEM,
                for: 'master',
                authority: [],
                meta: {
                    description: {
                        translateKey: 'nav.clientsLab.listDesc',
                        label: 'AI-powered chat systems',
                    },
                },
                subMenu: [],
            },
        ],
    },
]

export default clientNavigationConfig
