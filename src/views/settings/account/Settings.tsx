import { lazy, Suspense } from 'react'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import SettingsMenu from './components/SettingsMenu'
import SettingMobileMenu from './components/SettingMobileMenu'
import useResponsive from '@/utils/hooks/useResponsive'
import { useSettingsStore } from './store/settingsStore'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { profileSchema } from '@/schemas/account.schema'
import { EMPTY_VALUES } from '@/constants/account.constant'

const Profile = lazy(() => import('./components/SettingsProfile'))
const Security = lazy(() => import('./components/SettingsSecurity'))
const Notification = lazy(() => import('./components/SettingsNotification'))
const Locations = lazy(() => import('./components/SettingsLocations'))

const Settings = () => {
    const { currentView } = useSettingsStore()

    const { smaller, larger } = useResponsive()

    const methods = useForm({
        resolver: zodResolver(profileSchema),
        defaultValues: EMPTY_VALUES,
        mode: 'onChange',
    })

    return (
        <FormProvider {...methods}>
            <AdaptiveCard className="h-full">
                <div className="flex flex-auto h-full">
                    {larger.lg && (
                        <div className="'w-[200px] xl:w-[280px]">
                            <SettingsMenu />
                        </div>
                    )}
                    <div className="xl:ltr:pl-6 xl:rtl:pr-6 flex-1 py-2">
                        {smaller.lg && (
                            <div className="mb-6">
                                <SettingMobileMenu />
                            </div>
                        )}
                        <Suspense fallback={<></>}>
                            {currentView === 'profile' && <Profile />}
                            {currentView === 'security' && <Security />}
                            {currentView === 'notification' && <Notification />}
                            {currentView === 'location' && <Locations />}
                        </Suspense>
                    </div>
                </div>
            </AdaptiveCard>
        </FormProvider>
    )
}

export default Settings
