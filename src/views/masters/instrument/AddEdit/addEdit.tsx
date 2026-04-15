/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router'
import InstrumentForm from '../Form'
import BottomPanel from '@/components/form/bottomPanel'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import endpointConfig from '@/configs/endpoint.config'
import { useDiscardConfirm } from '@/utils/hooks/useDiscardConfirm'
import { useInstrumentDetail } from '../List/hooks/useInstrumentDetail'
import { useFormSubmit } from '@/utils/hoc/useFormSubmit'
import { getMode } from '@/utils/getMode'
import { useEntityMutations } from '@/utils/hooks/useEntityMutations'
import {
    apiInstrument,
    apiUpdateInstrument,
} from '@/services/InstrumentService'
import { InstrumentFormSchema } from '@/schemas/instrument.schema'
import { EMPTY_VALUES } from '@/constants/instrument.constant'
import { FormSkeleton } from '@/components/form'

const InstrumentAddEdit = () => {
    const navigate = useNavigate()
    const { id } = useParams<{ id: string }>()
    const location = useLocation()
    const mode = useMemo(() => getMode(location.pathname), [location.pathname])
    const isView = mode === 'view'
    const isEdit = mode === 'edit'

    const { instrument, isLoading, mutate } = useInstrumentDetail(id)
    const discard = useDiscardConfirm()

    const { save } = useEntityMutations<InstrumentFormSchema>({
        apiCreate: apiInstrument,
        apiUpdate: apiUpdateInstrument,
    })

    const { handleSubmit, isSubmitting } = useFormSubmit<InstrumentFormSchema>({
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
        navigateTo: endpointConfig.master.instrument.list,
    })

    const confirmDiscard = () => {
        toast.push(
            <Notification type="success">Changes discarded</Notification>,
            { placement: 'top-center' },
        )
        discard.close()
        navigate(`${endpointConfig.master.instrument.list}`)
    }
    if ((isEdit || isView) && isLoading) {
        return <FormSkeleton count={5} title={'Instrument'} />
    }

    return (
        <>
            <InstrumentForm
                key={id || 'new'}
                defaultValues={instrument || EMPTY_VALUES}
                readOnly={isView}
                onFormSubmit={handleSubmit}
            >
                <BottomPanel
                    isView={isView}
                    isSubmitting={isSubmitting}
                    isEdit={isEdit}
                    onDiscard={discard.show}
                />
            </InstrumentForm>

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

export default InstrumentAddEdit
