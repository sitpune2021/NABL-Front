import { lazy } from 'react'
import type { Routes } from '@/@types/routes'
import endpointConfig from '../endpoint.config'

const settingRoute: Routes = [
    {
        key: 'settings.standard.list',
        path: `${endpointConfig.setting.standard.list}`,
        component: lazy(() => import('@/views/settings/standard/List')),
        authority: [],
    },
    {
        key: 'settings.standard.list',
        path: `${endpointConfig.setting.standard.create}`,
        component: lazy(() => import('@/views/settings/standard/AddEdit')),
        authority: [],
    },
    {
        key: 'settings.standard.list',
        path: endpointConfig.setting.standard.edit,
        component: lazy(() => import('@/views/settings/standard/AddEdit')),
        authority: [],
    },
    {
        key: 'settings.standard.list',
        path: endpointConfig.setting.standard.view,
        component: lazy(() => import('@/views/settings/standard/AddEdit')),
        authority: [],
    },
    {
        key: 'settings.standard.list',
        path: `${endpointConfig.setting.clauses.create}`,
        component: lazy(() => import('@/views/masters/clauses/AddEdit')),
        authority: [],
    },
    {
        key: 'settings.standard.list',
        path: `${endpointConfig.setting.clauses.edit}`,
        component: lazy(() => import('@/views/masters/clauses/AddEdit')),
        authority: [],
    },
    {
        key: 'settings.user.list',
        path: `${endpointConfig.setting.user.list}`,
        component: lazy(() => import('@/views/masters/user/List')),
        authority: [],
    },
    {
        key: 'settings.user.list',
        path: `${endpointConfig.setting.user.create}`,
        component: lazy(() => import('@/views/masters/user/AddEdit')),
        authority: [],
        meta: {
            header: {
                title: 'Create Users',
                description:
                    'Manage Users details, track Users, and update Users easily.',
                contained: true,
            },
        },
    },
    {
        key: 'settings.user.list',
        path: endpointConfig.setting.user.edit,
        component: lazy(() => import('@/views/masters/user/AddEdit')),
        authority: [],
    },
    {
        key: 'settings.user.list',
        path: endpointConfig.setting.user.view,
        component: lazy(() => import('@/views/masters/user/AddEdit')),
        authority: [],
    },
    {
        key: 'settings.rolesPermission.list',
        path: `${endpointConfig.setting.rolesPermission.list}`,
        component: lazy(() => import('@/views/masters/RolesPermissions')),
        authority: [],
        meta: {
            pageContainerType: 'contained',
            pageBackgroundType: 'plain',
        },
    },
    {
        key: 'settings.account.list',
        path: `${endpointConfig.setting.account.profile}`,
        component: lazy(() => import('@/views/settings/account/Settings')),
        authority: [],
        meta: {
            pageContainerType: 'contained',
            pageBackgroundType: 'plain',
        },
    },
    {
        key: 'settings.menu.list',
        path: `${endpointConfig.setting.menu.list}`,
        component: lazy(() => import('@/views/settings/menu/List')),
        authority: [],
    },

    // {
    //     key: 'settings.menu.list',
    //     path: endpointConfig.setting.menu.edit,
    //     component: lazy(() => import('@/views/settings/menu/AddEdit')),
    //     authority: [],
    // },
    // {
    //     key: 'settings.menu.list',
    //     path: endpointConfig.setting.menu.view,
    //     component: lazy(() => import('@/views/settings/menu/AddEdit')),
    //     authority: [],
    // },
]

export default settingRoute
