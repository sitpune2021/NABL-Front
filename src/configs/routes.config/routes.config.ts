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
]
