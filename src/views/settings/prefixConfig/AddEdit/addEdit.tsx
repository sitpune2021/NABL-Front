/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router'

import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import ConfirmDialog from '@/components/shared/ConfirmDialog'

import PrefixForm from '../Form'
import BottomPanel from '@/components/form/bottomPanel'

import endpointConfig from '@/configs/endpoint.config'
import { getMode } from '@/utils/getMode'

import { useDiscardConfirm } from '@/utils/hooks/useDiscardConfirm'
import { useFormSubmit } from '@/utils/hoc/useFormSubmit'

import { apiCreatePrefix, apiUpdatePrefix } from '@/services/prefixService'

import { PrefixFormSchema } from '@/schemas/prefix.schema'

import { FormSkeleton } from '@/components/form'
import { usePrefixDetail } from '../List/hooks/usePrefixDetail'

const EMPTY_VALUES: PrefixFormSchema = {
    prefix_master: '',
    type: '',
    min_length: '' as any,
    max_length: '' as any,
}

const PrefixAddEdit = () => {
    const navigate = useNavigate()

    const location = useLocation()

    const { id } = useParams<{ id: string }>()

    const mode = useMemo(() => getMode(location.pathname), [location.pathname])

    const isView = mode === 'view'

    const isEdit = mode === 'edit'

    const discard = useDiscardConfirm()

    const { prefix, isLoading } = usePrefixDetail(id)

    const { handleSubmit, isSubmitting } = useFormSubmit<PrefixFormSchema>({
        apiCall: async (values) => {
            if (isEdit && id) {
                return await apiUpdatePrefix(Number(id), values)
            }

            return await apiCreatePrefix(values)
        },

        navigateTo: endpointConfig.setting.prefixConfig.list,
    })

    const confirmDiscard = () => {
        toast.push(
            <Notification type="success">Changes discarded</Notification>,
            {
                placement: 'top-center',
            },
        )

        discard.close()

        navigate(endpointConfig.setting.prefixConfig.list)
    }

    if ((isEdit || isView) && isLoading) {
        return <FormSkeleton count={3} title="Prefix Config" />
    }

    return (
        <>
            <PrefixForm
                key={id || 'new'}
                defaultValues={prefix ?? EMPTY_VALUES}
                readOnly={isView}
                onFormSubmit={handleSubmit}
            >
                <BottomPanel
                    isView={isView}
                    isEdit={isEdit}
                    isSubmitting={isSubmitting}
                    onDiscard={discard.show}
                />
            </PrefixForm>

            <ConfirmDialog
                isOpen={discard.open}
                type="danger"
                title="Discard changes"
                onClose={discard.close}
                onCancel={discard.close}
                onConfirm={confirmDiscard}
            >
                <p>Are you sure you want discard this?</p>
            </ConfirmDialog>
        </>
    )
}

export default PrefixAddEdit
