import { lazy } from 'react'
import authRoute from './authRoute'
import type { Routes } from '@/@types/routes'
import masterRoute from './masterRoute'
import endpointConfig from '../endpoint.config'
import settingRoute from './settingRoute'

export const publicRoutes: Routes = [...authRoute]

export const protectedRoutes: Routes = [
    {
        key: 'home',
        path: endpointConfig.dashbord,
        component: lazy(() => import('@/views/dashboard/Home')),
        authority: [],
    },
    ...masterRoute,
    ...settingRoute,
    {
        key: 'works.tasks.list',
        path: endpointConfig.works.tasks.list,
        component: lazy(() => import('@/views/works/tasks/List')),
        authority: [],
    },
    {
        key: 'works.tasks.list',
        path: endpointConfig.works.tasks.task,
        component: lazy(
            () => import('@/views/works/tasks/List/components/list'),
        ),
        authority: [],
    },
    {
        key: 'clients.lab.list',
        path: endpointConfig.client.lab.list,
        component: lazy(() => import('@/views/masters/lab/List')),
        authority: [],
    },
    {
        key: 'clients.lab.list',
        path: endpointConfig.client.lab.create,
        component: lazy(() => import('@/views/masters/lab/AddEdit')),
        authority: [],
    },
    {
        key: 'clients.lab.list',
        path: endpointConfig.client.lab.edit,
        component: lazy(() => import('@/views/masters/lab/AddEdit')),
        authority: [],
    },
    {
        key: 'clients.lab.list',
        path: endpointConfig.client.lab.location,
        component: lazy(() => import('@/views/masters/lab/List')),
        authority: [],
    },
    {
        key: 'clients.lab.list',
        path: endpointConfig.client.lab.view,
        component: lazy(() => import('@/views/masters/lab/AddEdit')),
        authority: [],
    },

    {
        key: 'clients.lab.assignments.list',
        path: endpointConfig.client.labAssignment.list,
        component: lazy(
            () => import('@/views/masters/labAssignments/Assignment'),
        ),
        authority: [],
    },
    {
        key: 'accessDenied',
        path: `/access-denied`,
        component: lazy(() => import('@/views/others/AccessDenied')),
        authority: [],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
        },
    },
]
