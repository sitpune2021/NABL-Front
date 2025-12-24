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
        key: 'settings.standard.lis',
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
            footer: false,
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
]

export default settingRoute
