import { lazy } from 'react'
import authRoute from './authRoute'
import othersRoute from './othersRoute'
import type { Routes } from '@/@types/routes'

export const publicRoutes: Routes = [...authRoute]

export const protectedRoutes: Routes = [
    {
        key: 'home',
        path: '/home',
        component: lazy(() => import('@/views/Home')),
        authority: [],
    },
    {
        key: 'master.template.list',
        path: `/master/template`,
        component: lazy(() => import('@/views/master/template/TemplateList')),
        authority: [],
    },
    {
        key: 'master.template.list',
        path: `/master/template/template-create`,
        component: lazy(() => import('@/views/master/template/TemplateCreate')),
        authority: [],
    },
    {
        key: 'master.category.list',
        path: `/master/category`,
        component: lazy(() => import('@/views/master/category/CategoryList')),
        authority: [],
    },
    {
        key: 'master.category.list',
        path: `/master/category/category-create`,
        component: lazy(() => import('@/views/master/category/CategoryCreate')),
        authority: [],
    },
    ...othersRoute,
]
