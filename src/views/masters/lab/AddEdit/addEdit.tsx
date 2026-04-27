/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router'

import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import ConfirmDialog from '@/components/shared/ConfirmDialog'

import endpointConfig from '@/configs/endpoint.config'

import useDocumentList from '../../document/List/hooks/useList'
import useLabList from '../List/hooks/useList'
import { useLabDetail } from '../List/hooks/useLabDetail'

import { getMode } from '@/utils/getMode'
import { useDiscardConfirm } from '@/utils/hooks/useDiscardConfirm'
import { useEntityMutations } from '@/utils/hooks/useEntityMutations'
import { useFormSubmit } from '@/utils/hoc/useFormSubmit'

import { apiLab, apiUpdateLab } from '@/services/LabService'
import { Lab } from '@/@types/lab'
import LabFormStepsWrapper from '../Form'
import { getEmptyValues } from '@/constants/lab.constant'
import { useLocationListStore } from '../../location/List/store/listStore'
import { useClusterListStore } from '../../cluster/List/store/listStore'

const LabAddEdit = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { id } = useParams<{ id?: string }>()

    const mode = getMode(location.pathname)
    const isView = mode === 'view'
    const isEdit = mode === 'edit'

    const discard = useDiscardConfirm()

    const { lab, isLoading, mutate } = useLabDetail(id)
    const { documentList, isLoading: docIsLoading } = useDocumentList()
    const clusterReset = useClusterListStore((state) => state.resetFilters)
    const locationReset = useLocationListStore((state) => state.resetFilters)

    const { labList } = useLabList()

    const { save } = useEntityMutations<Lab>({
        apiCreate: apiLab,
        apiUpdate: apiUpdateLab,
    })

    const defaultValues = useMemo(() => {
        if (lab) return lab

        const base = getEmptyValues(labList.length)

        if (documentList?.length) {
            return {
                ...base,
                documents: documentList.map((doc) => doc.id),
            }
        }

        return base
    }, [lab, labList.length, documentList])

    const { handleSubmit, isSubmitting } = useFormSubmit<Lab>({
        apiCall: async (values) => {
            const res = await save(isEdit && id ? { ...values, id } : values)
            locationReset()
            clusterReset()

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
        navigateTo: endpointConfig.client.lab.list,
    })

    const confirmDiscard = () => {
        toast.push(
            <Notification type="success">Changes discarded</Notification>,
            { placement: 'top-center' },
        )
        discard.close()
        navigate(endpointConfig.client.lab.list)
    }

    if (isLoading || docIsLoading) {
        return <p className="p-4">Loading lab data...</p>
    }

    return (
        <>
            <LabFormStepsWrapper
                labFormProps={{
                    defaultValues,
                    readOnly: isView,
                    onFormSubmit: handleSubmit,
                    isSubmitting,
                    isEdit,
                    isView,
                    onDiscard: discard.show,
                    documentList,
                }}
            />

            <ConfirmDialog
                isOpen={discard.open}
                type="danger"
                title="Discard changes"
                onClose={discard.close}
                onCancel={discard.close}
                onConfirm={confirmDiscard}
            >
                <p>
                    Are you sure you want to discard this? This action can’t be
                    undone.
                </p>
            </ConfirmDialog>
        </>
    )
}

export default LabAddEdit
