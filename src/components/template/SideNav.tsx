import classNames from '@/utils/classNames'
import ScrollBar from '@/components/ui/ScrollBar'
import Logo from '@/components/template/Logo'
import VerticalMenuContent from '@/components/template/VerticalMenuContent'
import { useThemeStore } from '@/store/themeStore'
import { useSessionUser } from '@/store/authStore'
import { useRouteKeyStore } from '@/store/routeKeyStore'
// import navigationConfig from '@/configs/navigation.config'
import appConfig from '@/configs/app.config'
import { Link } from 'react-router'
import {
    SIDE_NAV_WIDTH,
    SIDE_NAV_COLLAPSED_WIDTH,
    SIDE_NAV_CONTENT_GUTTER,
    HEADER_HEIGHT,
    LOGO_X_GUTTER,
} from '@/constants/theme.constant'
import type { Mode } from '@/@types/theme'
import useNavigationItemsList from '@/utils/hooks/useNavigationItem'
// import axios from 'axios'

type SideNavProps = {
    translationSetup?: boolean
    background?: boolean
    className?: string
    contentClass?: string
    mode?: Mode
}

const sideNavStyle = {
    width: SIDE_NAV_WIDTH,
    minWidth: SIDE_NAV_WIDTH,
}

const sideNavCollapseStyle = {
    width: SIDE_NAV_COLLAPSED_WIDTH,
    minWidth: SIDE_NAV_COLLAPSED_WIDTH,
}

const SideNav = ({
    translationSetup = appConfig.activeNavTranslation,
    background = true,
    className,
    contentClass,
    mode,
}: SideNavProps) => {
    const defaultMode = useThemeStore((state) => state.mode)
    const direction = useThemeStore((state) => state.direction)
    const sideNavCollapse = useThemeStore(
        (state) => state.layout.sideNavCollapse,
    )

    const currentRouteKey = useRouteKeyStore((state) => state.currentRouteKey)

    const userAuthority = useSessionUser((state) => state.user.authority)

    const { navigationItems } = useNavigationItemsList()

    // const uploadFullNavigationTree = async () => {
    //     try {
    //         const response = await axios.post('http://192.168.1.32:8000/api/navigation-items', navigationConfig)
    //         const savedItem = response.data
    //         return savedItem
    //     } catch (error:any) {
    //         console.error('Failed to send item:', error.response?.data || error.message)
    //     }

    //     console.log('✅ All navigation items uploaded')
    // }

    // uploadFullNavigationTree()

    return (
        <div
            style={sideNavCollapse ? sideNavCollapseStyle : sideNavStyle}
            className={classNames(
                'side-nav',
                background && 'side-nav-bg',
                !sideNavCollapse && 'side-nav-expand',
                className,
            )}
        >
            <Link
                to={appConfig.authenticatedEntryPath}
                className="side-nav-header flex flex-col justify-center"
                style={{ height: HEADER_HEIGHT }}
            >
                <Logo
                    imgClass="max-h-10"
                    mode={mode || defaultMode}
                    type={sideNavCollapse ? 'streamline' : 'full'}
                    className={classNames(
                        sideNavCollapse && 'ltr:ml-[11.5px] ltr:mr-[11.5px]',
                        sideNavCollapse
                            ? SIDE_NAV_CONTENT_GUTTER
                            : LOGO_X_GUTTER,
                    )}
                />
            </Link>
            <div className={classNames('side-nav-content', contentClass)}>
                <ScrollBar style={{ height: '100%' }} direction={direction}>
                    <VerticalMenuContent
                        collapsed={sideNavCollapse}
                        navigationTree={navigationItems}
                        routeKey={currentRouteKey}
                        direction={direction}
                        translationSetup={translationSetup}
                        userAuthority={userAuthority || []}
                    />
                </ScrollBar>
            </div>
        </div>
    )
}

export default SideNav
