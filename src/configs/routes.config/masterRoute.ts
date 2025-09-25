import { lazy } from 'react'
import type { Routes } from '@/@types/routes'

const masterRoute: Routes = [
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
