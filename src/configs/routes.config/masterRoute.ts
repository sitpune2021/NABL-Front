import { lazy } from 'react'
import type { Routes } from '@/@types/routes'
import endpointConfig from '../endpoint.config'

const masterRoute: Routes = [
    {
        key: 'masters.category.list',
        path: `${endpointConfig.master.category.list}`,
        component: lazy(() => import('@/views/masters/category/List')),
        authority: [],
        meta: {
            header: {
                title: 'Category',
                description:
                    'Manage customer details, purchase history, and preferences.',
            },
        },
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
        path: endpointConfig.master.document.edit,
        component: lazy(() => import('@/views/masters/document/AddEdit')),
        authority: [],
    },
    {
        key: 'masters.document.list',
        path: `${endpointConfig.master.document.editorEdit}`,
        component: lazy(() => import('@/views/masters/document/AddEdit')),
        authority: [],
        // meta: {
        //     layout: 'blank',
        //     footer: false,
        //     pageContainerType: 'gutterless',
        // },
    },
    {
        key: 'masters.document.list',
        path: endpointConfig.master.document.view,
        component: lazy(() => import('@/views/masters/document/AddEdit')),
        authority: [],
    },
    {
        key: 'masters.document.list',
        path: endpointConfig.master.document.editorview,
        component: lazy(() => import('@/views/masters/document/AddEdit')),
        authority: [],
    },
    {
        key: 'masters.document.list',
        path: endpointConfig.master.document.dataEntry,
        component: lazy(
            () =>
                import(
                    '@/views/masters/document/List/components/DynamicWrapper'
                ),
        ),
        authority: [],
    },
    {
        key: 'masters.document.list',
        path: endpointConfig.master.document.dataEntryList,
        component: lazy(() => import('@/views/masters/document/List')),
        authority: [],
    },
    {
        key: 'masters.template.list',
        path: `${endpointConfig.master.template.list}`,
        component: lazy(() =>
            import('@/views/masters/template/List').then((module) => ({
                default: module.TemplateList,
            })),
        ),
        authority: [],
    },
    {
        key: 'masters.template.list',
        path: `${endpointConfig.master.template.versions.list}`,
        component: lazy(() =>
            import('@/views/masters/template/List').then((module) => ({
                default: module.VersionList,
            })),
        ),
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
        key: 'masters.template.list',
        path: `${endpointConfig.master.template.view}`,
        component: lazy(() => import('@/views/masters/template/AddEdit')),
        authority: [],
    },

    {
        key: 'masters.template.write.version.write',
        path: `${endpointConfig.master.template.versions.view}`,
        component: lazy(() => import('@/views/masters/template/AddEdit')),
        authority: [],
    },

    {
        key: 'masters.location.list',
        path: `${endpointConfig.master.location.list}`,
        component: lazy(() => import('@/views/masters/location/List')),
        authority: [],
    },
    {
        key: 'masters.location.list',
        path: endpointConfig.master.location.create,
        component: lazy(() => import('@/views/masters/location/AddEdit')),
        authority: [],
    },
    {
        key: 'masters.location.list',
        path: endpointConfig.master.location.edit,
        component: lazy(() => import('@/views/masters/location/AddEdit')),
        authority: [],
    },
    {
        key: 'masters.location.list',
        path: endpointConfig.master.location.view,
        component: lazy(() => import('@/views/masters/location/AddEdit')),
        authority: [],
    },

    {
        key: 'masters.zone.list',
        path: endpointConfig.master.zone.list,
        component: lazy(() => import('@/views/masters/zone/List')),
        authority: [],
    },
    {
        key: 'masters.zone.list',
        path: endpointConfig.master.zone.create,
        component: lazy(() => import('@/views/masters/zone/AddEdit')),
        authority: [],
    },
    {
        key: 'masters.zone.list',
        path: endpointConfig.master.zone.edit,
        component: lazy(() => import('@/views/masters/zone/AddEdit')),
        authority: [],
    },
    {
        key: 'masters.zone.list',
        path: endpointConfig.master.zone.view,
        component: lazy(() => import('@/views/masters/zone/AddEdit')),
        authority: [],
    },

    {
        key: 'masters.cluster.list',
        path: endpointConfig.master.cluster.list,
        component: lazy(() => import('@/views/masters/cluster/List')),
        authority: [],
    },
    {
        key: 'masters.cluster.list',
        path: endpointConfig.master.cluster.create,
        component: lazy(() => import('@/views/masters/cluster/AddEdit')),
        authority: [],
    },
    {
        key: 'masters.cluster.list',
        path: endpointConfig.master.cluster.edit,
        component: lazy(() => import('@/views/masters/cluster/AddEdit')),
        authority: [],
    },
    {
        key: 'masters.cluster.list',
        path: endpointConfig.master.cluster.view,
        component: lazy(() => import('@/views/masters/cluster/AddEdit')),
        authority: [],
    },

    {
        key: 'masters.instrument.list',
        path: `${endpointConfig.master.instrument.list}`,
        component: lazy(() => import('@/views/masters/instrument/List')),
        authority: [],
    },
    {
        key: 'masters.instrument.list',
        path: `${endpointConfig.master.instrument.create}`,
        component: lazy(() => import('@/views/masters/instrument/AddEdit')),
        authority: [],
    },
    {
        key: 'masters.instrument.list',
        path: endpointConfig.master.instrument.edit,
        component: lazy(() => import('@/views/masters/instrument/AddEdit')),
        authority: [],
    },
    {
        key: 'masters.instrument.list',
        path: endpointConfig.master.instrument.view,
        component: lazy(() => import('@/views/masters/instrument/AddEdit')),
        authority: [],
    },
]

export default masterRoute
