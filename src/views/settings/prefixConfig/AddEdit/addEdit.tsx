/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router'

import PrefixConfigForm from '../Form'
import BottomPanel from '@/components/form/bottomPanel'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'

import endpointConfig from '@/configs/endpoint.config'
import { useDiscardConfirm } from '@/utils/hooks/useDiscardConfirm'
import { usePrefixConfigDetail } from '../List/hooks/usePrefixConfigDetail'
import { useFormSubmit } from '@/utils/hoc/useFormSubmit'
import { getMode } from '@/utils/getMode'
import { useEntityMutations } from '@/utils/hooks/useEntityMutations'
import {
    apiPrefixConfig,
    apiUpdatePrefixConfig,
} from '@/services/prefixConfigService'
import { PrefixConfigFormSchema } from '@/schemas/prefixConfig.schema'
import { EMPTY_VALUES } from '@/constants/prefixConfig.constant'
import { FormSkeleton } from '@/components/form'

const PrefixConfigAddEdit = () => {
    const navigate = useNavigate()
    const { id } = useParams<{ id: string }>()
    const location = useLocation()
    const mode = useMemo(() => getMode(location.pathname), [location.pathname])
    const isView = mode === 'view'
    const isEdit = mode === 'edit'

    const { prefixConfig, isLoading, mutate } = usePrefixConfigDetail(id)
    const discard = useDiscardConfirm()

    const { save } = useEntityMutations<PrefixConfigFormSchema>({
        apiCreate: apiPrefixConfig,
        apiUpdate: apiUpdatePrefixConfig,
    })

    const { handleSubmit, isSubmitting } =
        useFormSubmit<PrefixConfigFormSchema>({
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
            navigateTo: endpointConfig.setting.prefixConfig.list,
        })

    const confirmDiscard = () => {
        toast.push(
            <Notification type="success">Changes discarded</Notification>,
            { placement: 'top-center' },
        )
        discard.close()
        navigate(`${endpointConfig.setting.prefixConfig.list}`)
    }

    if ((isEdit || isView) && isLoading) {
        return <FormSkeleton count={2} title={'PrefixConfig'} />
    }

    const defaultValues = {
        ...EMPTY_VALUES,
        ...prefixConfig,
        segments: prefixConfig?.segments?.length
            ? prefixConfig.segments
            : EMPTY_VALUES.segments,
    } as PrefixConfigFormSchema

    return (
        <>
            <PrefixConfigForm
                key={id || 'new'}
                defaultValues={defaultValues}
                readOnly={isView}
                onFormSubmit={handleSubmit}
            >
                <BottomPanel
                    isView={isView}
                    isSubmitting={isSubmitting}
                    isEdit={isEdit}
                    onDiscard={discard.show}
                />
            </PrefixConfigForm>

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

export default PrefixConfigAddEdit
