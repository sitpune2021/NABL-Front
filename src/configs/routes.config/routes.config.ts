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
        key: 'template',
        path: `/master/template`,
        component: lazy(() => import('@/views/template/TemplateList')),
        authority: [],
    },
    {
        key: 'template.templateCreate',
        path: `/master/template/template-create`,
        component: lazy(() => import('@/views/template/TemplateCreate')),
        authority: [],
        meta: {
            header: {
                title: 'Create customer',
                description:
                    'Manage customer details, track purchases, and update preferences easily.',
                contained: true,
            },
            footer: false,
        },
    },
    ...othersRoute,
]
