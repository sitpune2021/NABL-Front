/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react'
import { Form } from '@/components/ui/Form'
import Button from '@/components/ui/Button'
import BottomStickyBar from '@/components/template/BottomStickyBar'
import ProfileOverview from './ProfileOverview'
import {
    apiGetSettingsProfile,
    apiUpdateSettingsProfile,
} from '@/services/AccontsService'
import useSWR from 'swr'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, FormProvider } from 'react-hook-form'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import { profileSchema, type ProfileFormSchema } from '@/schemas/account.schema'
import { EMPTY_VALUES, LIST_KEY } from '@/constants/account.constant'
import { useApiError } from '@/utils/hoc/useApiError'

const SettingsProfile = () => {
    const apiError = useApiError()
    const { data: profileData, mutate } = useSWR(
        LIST_KEY,
        () => apiGetSettingsProfile<any>(),
        { revalidateOnFocus: false },
    )

    const methods = useForm<ProfileFormSchema>({
        resolver: zodResolver(profileSchema),
        mode: 'onChange',
        defaultValues: EMPTY_VALUES,
    })

    const {
        handleSubmit,
        reset,
        formState: { isSubmitting },
    } = methods

    useEffect(() => {
        if (profileData?.data) {
            const raw = profileData.data
            const mappedData = {
                ...raw,
                location:
                    raw.userRoles?.map((role: any) => ({
                        zone_id: role.zone_id,
                        cluster_id: role.cluster_id,
                        location_id: role.location_id,
                        departments: role.department?.map((dept: any) => ({
                            name: dept.department_id,
                            instruments: [],
                        })),
                    })) || [],
            }
            reset(mappedData)
        }
    }, [profileData, reset])

    const onSubmit = async (values: ProfileFormSchema) => {
        try {
            const resp = await apiUpdateSettingsProfile<any, ProfileFormSchema>(
                values,
            )
            if (resp) {
                mutate()
                toast.push(
                    <Notification title="Success" type="success">
                        Profile updated!
                    </Notification>,
                )
            }
        } catch (error) {
            apiError(error, 'Failed to update.')
        }
    }

    return (
        <FormProvider {...methods}>
            <Form
                className="h-full flex flex-col justify-between"
                onSubmit={handleSubmit(onSubmit)}
            >
                <ProfileOverview />

                <BottomStickyBar>
                    <div className="flex items-center justify-end gap-2 p-4">
                        <Button type="button" onClick={() => reset()}>
                            Reset
                        </Button>
                        <Button
                            variant="solid"
                            type="submit"
                            loading={isSubmitting}
                        >
                            Update
                        </Button>
                    </div>
                </BottomStickyBar>
            </Form>
        </FormProvider>
    )
}

export default SettingsProfile
