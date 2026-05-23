/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import endpointConfig from '@/configs/endpoint.config'
import BottomPanel from '@/components/form/bottomPanel'
import StandardForm from '../Form'
import { EMPTY_VALUES } from '@/constants/standard.constant'
import { StandardFormSchema } from '@/schemas/standard.schema'
import { getMode } from '@/utils/getMode'
import { useDiscardConfirm } from '@/utils/hooks/useDiscardConfirm'
import { useFormSubmit } from '@/utils/hoc/useFormSubmit'
import { useEntityMutations } from '@/utils/hooks/useEntityMutations'
import {
    apiCreateStandard,
    apiUpdateStandard,
} from '@/services/StandardService'
import { useStandardDetail } from '../List/hooks/useDetail'
import { FormSkeleton } from '@/components/form'

const AddEdit = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { id } = useParams<{ id: string }>()
    const numericId = id ? Number(id) : undefined

    const mode = useMemo(() => getMode(location.pathname), [location.pathname])
    const isView = mode === 'view'
    const isEdit = mode === 'edit'

    const { standard, isLoading, mutate } = useStandardDetail(numericId)
    const discard = useDiscardConfirm()

    const { save } = useEntityMutations<StandardFormSchema>({
        apiCreate: apiCreateStandard,
        apiUpdate: apiUpdateStandard,
    })

    const addDepthToClauses = (data: any): StandardFormSchema => {
        const mapItem = (item: any, currentDepth = 0) => {
            const children = Array.isArray(item.children)
                ? item.children.map((c: any) => mapItem(c, currentDepth + 1))
                : []

            return {
                id: item?.id ?? null,
                parent_id: item?.parent_id ?? null,
                title: item?.title ?? '',
                message: item?.message ?? '',
                note: item?.note ?? true,
                is_child: item?.is_child ?? false,
                children_count: Number(item?.children_count ?? 0),
                children,
                numbering_type: item?.numbering_type ?? 'none',
                numbering_value: item?.numbering_value ?? '',
                depth: currentDepth,
            }
        }

        return {
            ...data,
            clauses: Array.isArray(data?.clauses)
                ? data.clauses.map((c: any) => mapItem(c, 0))
                : [],
        }
    }

    const stripDepthFromClauses = (data: any) => {
        const mapItem = (item: any) => {
            const { depth, reactId, ...rest } = item || {}
            console.log(depth, reactId)
            return {
                ...rest,
                children: Array.isArray(item?.children)
                    ? item.children.map((c: any) => mapItem(c))
                    : [],
            }
        }

        const { clauses, ...rest } = data || {}
        return {
            ...rest,
            clauses: Array.isArray(clauses)
                ? clauses.map((c: any) => mapItem(c))
                : [],
        }
    }

    const { handleSubmit, isSubmitting } = useFormSubmit<StandardFormSchema>({
        apiCall: async (values) => {
            const payload = stripDepthFromClauses(values)

            const res = await save({
                ...payload,
                ...(isEdit && id ? { id } : {}),
            })

            if (id) {
                mutate(addDepthToClauses(res.data), false)
            }

            return res
        },
        navigateTo: endpointConfig.setting.standard.list,
    })

    const confirmDiscard = () => {
        toast.push(
            <Notification type="success">Changes discarded</Notification>,
            { placement: 'top-center' },
        )
        discard.close()
        navigate(`${endpointConfig.setting.standard.list}`)
    }

    if ((isEdit || isView) && isLoading) {
        return <FormSkeleton count={2} title={'Category'} />
    }

    return (
        <>
            <StandardForm
                key={id || 'new'}
                defaultValues={
                    standard ? addDepthToClauses(standard) : EMPTY_VALUES
                }
                readOnly={isView}
                onFormSubmit={handleSubmit}
            >
                <BottomPanel
                    isView={isView}
                    isEdit={isEdit}
                    isSubmitting={isSubmitting}
                    onDiscard={discard.show}
                />
            </StandardForm>

            <ConfirmDialog
                isOpen={discard.open}
                type="danger"
                title="Discard changes"
                onClose={discard.close}
                onCancel={discard.close}
                onConfirm={confirmDiscard}
            >
                <p>Are you sure you want to discard your changes?</p>
            </ConfirmDialog>
        </>
    )
}

export default AddEdit
