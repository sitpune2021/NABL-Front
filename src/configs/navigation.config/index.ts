import { NAV_ITEM_TYPE_ITEM } from '@/constants/navigation.constant'

import type { NavigationTree } from '@/@types/navigation'
import masterNavigationConfig from './master.navigation.config'
import endpointConfig from '../endpoint.config'
import settingNavigationConfig from './settings.navigation.config'

const navigationConfig: NavigationTree[] = [
    {
        key: 'home',
        path: `${endpointConfig.dashbord}`,
        title: 'Home',
        translateKey: 'nav.home',
        icon: 'home',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [],
        subMenu: [],
    },
    ...masterNavigationConfig,
    ...settingNavigationConfig,
]

export default navigationConfig
