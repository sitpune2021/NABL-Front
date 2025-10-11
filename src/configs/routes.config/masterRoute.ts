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

    // signatoryBy

    {
        key: 'masters.signatoryBy.list',
        path: `${endpointConfig.master.signatoryBy.list}`,
        component: lazy(() => import('@/views/masters/signatoryBy/List')),
        authority: [],
    },
    {
        key: 'masters.signatoryBy.list',
        path: `${endpointConfig.master.signatoryBy.create}`,
        component: lazy(() => import('@/views/masters/signatoryBy/AddEdit')),
        authority: [],
    },
    {
        key: 'masters.signatoryBy.list',
        path: endpointConfig.master.signatoryBy.edit,
        component: lazy(() => import('@/views/masters/signatoryBy/AddEdit')),
        authority: [],
    },
    {
        key: 'masters.signatoryBy.list',
        path: endpointConfig.master.signatoryBy.view,
        component: lazy(() => import('@/views/masters/signatoryBy/AddEdit')),
        authority: [],
    },
    // signatoryOn

    {
        key: 'masters.signatoryOn.list',
        path: `${endpointConfig.master.signatoryOn.list}`,
        component: lazy(() => import('@/views/masters/signatoryOn/List')),
        authority: [],
    },
    {
        key: 'masters.signatoryOn.list',
        path: `${endpointConfig.master.signatoryOn.create}`,
        component: lazy(() => import('@/views/masters/signatoryOn/AddEdit')),
        authority: [],
    },
    {
        key: 'masters.signatoryOn.list',
        path: endpointConfig.master.signatoryOn.edit,
        component: lazy(() => import('@/views/masters/signatoryOn/AddEdit')),
        authority: [],
    },
    {
        key: 'masters.signatoryOn.list',
        path: endpointConfig.master.signatoryOn.view,
        component: lazy(() => import('@/views/masters/signatoryOn/AddEdit')),
        authority: [],
    },
    // lab
    {
        key: 'masters.lab.list',
        path: `${endpointConfig.master.lab.list}`,
        component: lazy(() => import('@/views/masters/lab/List')),
        authority: [],
    },
    {
        key: 'masters.lab.list',
        path: `${endpointConfig.master.lab.create}`,
        component: lazy(() => import('@/views/masters/lab/AddEdit')),
        authority: [],
    },
    {
        key: 'masters.lab.list',
        path: endpointConfig.master.lab.edit,
        component: lazy(() => import('@/views/masters/lab/AddEdit')),
        authority: [],
    },
    {
        key: 'masters.lab.list',
        path: endpointConfig.master.lab.view,
        component: lazy(() => import('@/views/masters/lab/AddEdit')),
        authority: [],
    },
    // user
    {
        key: 'masters.user.list',
        path: `${endpointConfig.master.user.list}`,
        component: lazy(() => import('@/views/masters/user/List')),
        authority: [],
    },
    {
        key: 'masters.user.list',
        path: `${endpointConfig.master.user.create}`,
        component: lazy(() => import('@/views/masters/user/AddEdit')),
        authority: [],
    },
    {
        key: 'masters.user.list',
        path: endpointConfig.master.user.edit,
        component: lazy(() => import('@/views/masters/user/AddEdit')),
        authority: [],
    },
    {
        key: 'masters.user.list',
        path: endpointConfig.master.user.view,
        component: lazy(() => import('@/views/masters/user/AddEdit')),
        authority: [],
    },
    // template
    {
        key: 'masters.subcategory.list',
        path: `${endpointConfig.master.subcategory.list}`,
        component: lazy(() => import('@/views/masters/subcategory/List')),
        authority: [],
    },
    {
        key: 'masters.subcategory.list',
        path: `${endpointConfig.master.subcategory.create}`,
        component: lazy(() => import('@/views/masters/subcategory/AddEdit')),
        authority: [],
    },
    {
        key: 'masters.subcategory.list',
        path: endpointConfig.master.subcategory.edit,
        component: lazy(() => import('@/views/masters/subcategory/AddEdit')),
        authority: [],
    },
    {
        key: 'masters.subcategory.list',
        path: endpointConfig.master.subcategory.view,
        component: lazy(() => import('@/views/masters/subcategory/AddEdit')),
        authority: [],
    },

    {
        key: 'masters.document.list',
        path: `${endpointConfig.master.document.list}`,
        component: lazy(() => import('@/views/masters/document/List')),
        authority: [],
    },
    {
        key: 'masters.document.list',
        path: `${endpointConfig.master.document.create}`,
        component: lazy(() => import('@/views/masters/document/AddEdit')),
        authority: [],
    },
    {
        key: 'masters.document.list',
        path: `${endpointConfig.master.document.editor}/:id`,
        component: lazy(() => import('@/views/masters/document/AddEdit')),
        authority: [],
        meta: {
            layout: 'blank',
            footer: false,
            pageContainerType: 'gutterless',
        },
    },
    {
        key: 'masters.document.list',
        path: `${endpointConfig.master.document.editorEdit}`,
        component: lazy(() => import('@/views/masters/document/AddEdit')),
        authority: [],
        meta: {
            layout: 'blank',
            footer: false,
            pageContainerType: 'gutterless',
        },
    },
    {
        key: 'masters.document.list',
        path: endpointConfig.master.document.edit,
        component: lazy(() => import('@/views/masters/document/AddEdit')),
        authority: [],
    },
    {
        key: 'masters.document.list',
        path: endpointConfig.master.document.view,
        component: lazy(() => import('@/views/masters/document/AddEdit')),
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
        path: `${endpointConfig.master.template.create}/:type`,
        component: lazy(() => import('@/views/masters/template/AddEdit')),
        authority: [],
        meta: {
            layout: 'blank',
            footer: false,
            pageContainerType: 'gutterless',
        },
    },
    {
        key: 'masters.template.list',
        path: `${endpointConfig.master.template.edit}`,
        component: lazy(() => import('@/views/masters/template/AddEdit')),
        authority: [],
        meta: {
            layout: 'blank',
            footer: false,
            pageContainerType: 'gutterless',
        },
    },
    {
        key: 'masters.rolesPermission.list',
        path: `${endpointConfig.master.rolesPermission.list}`,
        component: lazy(() => import('@/views/masters/RolesPermissions')),
        authority: [],
        meta: {
            pageContainerType: 'contained',
            pageBackgroundType: 'plain',
        },
    },
    {
        key: 'masters.clauses.list',
        path: `${endpointConfig.master.clauses.list}`,
        component: lazy(() => import('@/views/masters/clauses/List')),
        authority: [],
    },
    {
        key: 'masters.clauses.list',
        path: `${endpointConfig.master.clauses.create}`,
        component: lazy(() => import('@/views/masters/clauses/AddEdit')),
        authority: [],
    },
    {
        key: 'masters.clauses.list',
        path: endpointConfig.master.clauses.edit,
        component: lazy(() => import('@/views/masters/clauses/AddEdit')),
        authority: [],
    },
    {
        key: 'masters.clauses.list',
        path: endpointConfig.master.clauses.view,
        component: lazy(() => import('@/views/masters/clauses/AddEdit')),
        authority: [],
    },
]

export default masterRoute
