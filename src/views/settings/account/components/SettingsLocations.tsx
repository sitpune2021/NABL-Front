/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import useSWR from 'swr'
import { Form } from '@/components/ui/Form'
import Button from '@/components/ui/Button'
import BottomStickyBar from '@/components/template/BottomStickyBar'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import SettingsLocationSection from './SettingsLocationSection'
import { useApiError } from '@/utils/hoc/useApiError'

import {
    apiGetSettingsProfile,
    apiUpdateSettingsProfile,
} from '@/services/AccontsService'
import { profileSchema, ProfileFormSchema } from '@/schemas/account.schema'
import { EMPTY_VALUES, LIST_KEY } from '@/constants/account.constant'

const SettingsLocations = () => {
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
        control,
        formState: { isSubmitting, errors },
    } = methods

    const [lists] = useState({
        zoneList: [],
        clusterList: [],
        locationList: [],
        departmentList: [],
        instrumentList: [],
    })

    useEffect(() => {
        if (profileData?.data) {
            const raw = profileData.data
            const mappedData = {
                ...raw,
                location:
                    raw.userRoles?.map((role: any) => ({
                        zone_name: role.zone_id,
                        cluster_name: role.cluster_id,
                        location_name: role.location_id,
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
                        Locations updated successfully!
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
                <div className="flex flex-col gap-6 p-2">
                    <div className="mt-4">
                        <SettingsLocationSection
                            control={control}
                            errors={errors}
                            zoneList={lists.zoneList}
                            clusterList={lists.clusterList}
                            locationList={lists.locationList}
                            departmentList={lists.departmentList}
                            instrumentList={lists.instrumentList}
                        />
                    </div>
                </div>

                <BottomStickyBar>
                    <div className="flex items-center justify-end gap-2 p-4">
                        <Button type="button" size="sm" onClick={() => reset()}>
                            Reset
                        </Button>
                        <Button
                            variant="solid"
                            type="submit"
                            size="sm"
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

export default SettingsLocations
