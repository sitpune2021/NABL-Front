/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router'

import ZoneForm from '../Form'
import BottomPanel from '@/components/form/bottomPanel'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'

import endpointConfig from '@/configs/endpoint.config'
import { useDiscardConfirm } from '@/utils/hooks/useDiscardConfirm'
import { useZoneDetail } from '../List/hooks/useZoneDetail'
import { useFormSubmit } from '@/utils/hoc/useFormSubmit'
import { getMode } from '@/utils/getMode'
import { useEntityMutations } from '@/utils/hooks/useEntityMutations'
import { apiZone, apiUpdateZone } from '@/services/ZoneService'
import { ZoneFormSchema } from '@/schemas/zone.schema'
import { EMPTY_VALUES } from '@/constants/zone.constant'
import { FormSkeleton } from '@/components/form'

const ZoneAddEdit = () => {
    const navigate = useNavigate()
    const { id } = useParams<{ id: string }>()
    const location = useLocation()
    const mode = useMemo(() => getMode(location.pathname), [location.pathname])
    const isView = mode === 'view'
    const isEdit = mode === 'edit'

    const { zone, isLoading, mutate } = useZoneDetail(id)
    const discard = useDiscardConfirm()

    const { save } = useEntityMutations<ZoneFormSchema>({
        apiCreate: apiZone,
        apiUpdate: apiUpdateZone,
    })

    const { handleSubmit, isSubmitting } = useFormSubmit<ZoneFormSchema>({
        apiCall: async (values) => {
            const res = await save({
                ...values,
                ...(isEdit && id ? { id } : {}),
            })
            if (id) {
                mutate(
                    (prev: any) => ({
                        ...prev,
                        data: res.data,
                    }),
                    false,
                )
            }
            return res
        },
        navigateTo: endpointConfig.master.zone.list,
    })

    const confirmDiscard = () => {
        toast.push(
            <Notification type="success">Changes discarded</Notification>,
            { placement: 'top-center' },
        )
        discard.close()
        navigate(`${endpointConfig.master.zone.list}`)
    }
    if ((isEdit || isView) && isLoading) {
        return <FormSkeleton count={2} title={'Category'} />
    }
    return (
        <>
            <ZoneForm
                key={id || 'new'}
                defaultValues={zone || EMPTY_VALUES}
                readOnly={isView}
                onFormSubmit={handleSubmit}
            >
                <BottomPanel
                    isView={isView}
                    isSubmitting={isSubmitting}
                    isEdit={isEdit}
                    onDiscard={discard.show}
                />
            </ZoneForm>

            <ConfirmDialog
                isOpen={discard.open}
                type="danger"
                title="Discard changes"
                onClose={discard.close}
                onCancel={discard.close}
                onConfirm={confirmDiscard}
            >
                <p>
                    Are you sure you want discard this? This action can&apos;t
                    be undo.
                </p>
            </ConfirmDialog>
        </>
    )
}

export default ZoneAddEdit
