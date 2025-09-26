import { lazy } from 'react'
import type { Routes } from '@/@types/routes'
import endpointConfig from '../endpoint.config'

const masterRoute: Routes = [
    {
        key: 'masters.category.list',
        path: `${endpointConfig.master.category.list}`,
        component: lazy(() => import('@/views/masters/category/List')),
        authority: [],
    },
    {
        key: 'masters.category.list',
        path: `${endpointConfig.master.category.create}`,
        component: lazy(() => import('@/views/masters/category/AddEdit')),
        authority: [],
    },
    {
        key: 'masters.category.list',
        path: endpointConfig.master.category.edit,
        component: lazy(() => import('@/views/masters/category/AddEdit')),
        authority: [],
    },
    {
        key: 'masters.category.list',
        path: endpointConfig.master.category.view,
        component: lazy(() => import('@/views/masters/category/AddEdit')),
        authority: [],
    },
]

export default masterRoute
