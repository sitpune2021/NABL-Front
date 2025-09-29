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
    {
        key: 'masters.department.list',
        path: `${endpointConfig.master.department.list}`,
        component: lazy(() => import('@/views/masters/department/List')),
        authority: [],
    },
    {
        key: 'masters.department.list',
        path: `${endpointConfig.master.department.create}`,
        component: lazy(() => import('@/views/masters/department/AddEdit')),
        authority: [],
    },
    {
        key: 'masters.department.list',
        path: endpointConfig.master.department.edit,
        component: lazy(() => import('@/views/masters/department/AddEdit')),
        authority: [],
    },
    {
        key: 'masters.department.list',
        path: endpointConfig.master.department.view,
        component: lazy(() => import('@/views/masters/department/AddEdit')),
        authority: [],
    },
    {
        key: 'masters.unit.list',
        path: `${endpointConfig.master.unit.list}`,
        component: lazy(() => import('@/views/masters/unit/List')),
        authority: [],
    },
    {
        key: 'masters.unit.list',
        path: `${endpointConfig.master.unit.create}`,
        component: lazy(() => import('@/views/masters/unit/AddEdit')),
        authority: [],
    },
    {
        key: 'masters.unit.list',
        path: endpointConfig.master.unit.edit,
        component: lazy(() => import('@/views/masters/unit/AddEdit')),
        authority: [],
    },
    {
        key: 'masters.unit.list',
        path: endpointConfig.master.unit.view,
        component: lazy(() => import('@/views/masters/unit/AddEdit')),
        authority: [],
    },
    {
        key: 'masters.roles.list',
        path: `${endpointConfig.master.roles.list}`,
        component: lazy(() => import('@/views/masters/roles/List')),
        authority: [],
    },
    {
        key: 'masters.roles.list',
        path: `${endpointConfig.master.roles.create}`,
        component: lazy(() => import('@/views/masters/roles/AddEdit')),
        authority: [],
    },
    {
        key: 'masters.roles.list',
        path: endpointConfig.master.roles.edit,
        component: lazy(() => import('@/views/masters/roles/AddEdit')),
        authority: [],
    },
    {
        key: 'masters.roles.list',
        path: endpointConfig.master.roles.view,
        component: lazy(() => import('@/views/masters/roles/AddEdit')),
        authority: [],
    },
    {
        key: 'masters.template.list',
        path: `${endpointConfig.master.template.list}`,
        component: lazy(() => import('@/views/masters/template/List')),
        authority: [],
    },
    {
        key: 'masters.template.list',
        path: `${endpointConfig.master.template.create}`,
        component: lazy(() => import('@/views/masters/template/AddEdit')),
        authority: [],
        meta: {
            layout: 'blank',
            footer: false,
            pageContainerType: 'gutterless',
        },
    },
]

export default masterRoute
