import { lazy } from 'react'
import type { Routes } from '@/@types/routes'

const masterRoute: Routes = [
    {
        key: 'masters.templates.list',
        path: `/masters/templates/list`,
        component: lazy(() => import('@/views/masters/template/TemplateList')),
        authority: [],
    },
    {
        key: 'masters.templates.list',
        path: `/masters/templates/create`,
        component: lazy(
            () => import('@/views/masters/template/TemplateCreate'),
        ),
        authority: [],
    },
    {
        key: 'masters.category.list',
        path: `/masters/category/list`,
        component: lazy(() => import('@/views/masters/category/CategoryList')),
        authority: [],
    },
    {
        key: 'masters.category.list',
        path: `/masters/category/create`,
        component: lazy(
            () => import('@/views/masters/category/CategoryCreate'),
        ),
        authority: [],
    },
]

export default masterRoute
