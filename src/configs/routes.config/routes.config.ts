import { lazy } from 'react'
import authRoute from './authRoute'
import othersRoute from './othersRoute'
import type { Routes } from '@/@types/routes'
import masterRoute from './masterRoute'
import endpointConfig from '../endpoint.config'

export const publicRoutes: Routes = [...authRoute]

export const protectedRoutes: Routes = [
    {
        key: 'home',
        path: `${endpointConfig.dashbord}`,
        component: lazy(() => import('@/views/dashboard/Home')),
        authority: [],
    },
    ...masterRoute,
    ...othersRoute,
]
