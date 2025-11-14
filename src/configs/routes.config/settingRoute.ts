import { lazy } from 'react'
import type { Routes } from '@/@types/routes'
import endpointConfig from '../endpoint.config'

const settingRoute: Routes = [
    {
        key: 'settings.category.list',
        path: `${endpointConfig.setting.config.list}`,
        component: lazy(() => import('@/views')),
        authority: [],
    },
]

export default settingRoute
