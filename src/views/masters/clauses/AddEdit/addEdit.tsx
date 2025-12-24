import { useMemo } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import ClausesForm from '../Form'
import { ClausesFormSchema } from '@/@types/clauses'
import BottomPanel from '@/components/form/bottomPanel'
import useDocumentList from '../../document/List/hooks/useList'
import { getMode } from '@/utils/getMode'
import { useCategoryList } from '../../category/List/hooks/useList'
import { useDiscardConfirm } from '@/utils/hooks/useDiscardConfirm'
import endpointConfig from '@/configs/endpoint.config'
import { useFormSubmit } from '@/utils/hoc/useFormSubmit'
import { useEntityMutations } from '@/utils/hooks/useEntityMutations'
import { apiCreateClauses, apiUpdateClauses } from '@/services/ClausesService'
import { useClauseDetail } from '../List/hooks/useDetail'
import { useStandardDetail } from '@/views/settings/standard/List/hooks/useDetail'

const EMPTY_VALUES = undefined

const ClausesAddEdit = () => {
    const navigate = useNavigate()
    const { id } = useParams<{ id: string }>()
    const location = useLocation()
    const mode = useMemo(() => getMode(location.pathname), [location.pathname])
    const isView = mode === 'view'
    const isEdit = mode === 'edit'

    const { clause, isLoading: clauseisLoading } = useClauseDetail(id)
    console.log(clause, 'clause')

    const { standard, isLoading } = useStandardDetail(id)
    const { categoryList } = useCategoryList()
    const { documentList } = useDocumentList()
    const discard = useDiscardConfirm()

    const defaultValues = useMemo(() => clause ?? EMPTY_VALUES, [clause])

    const { save } = useEntityMutations<ClausesFormSchema>({
        apiCreate: apiCreateClauses,
        apiUpdate: apiUpdateClauses,
    })

    const { handleSubmit, isSubmitting } = useFormSubmit<ClausesFormSchema>({
        apiCall: (values) =>
            save({ ...values, ...(isEdit && id ? { id } : {}) }),
        navigateTo: endpointConfig.setting.clauses.list,
    })

    const confirmDiscard = () => {
        toast.push(
            <Notification type="success">Changes discarded</Notification>,
            { placement: 'top-center' },
        )
        discard.close()
        navigate(endpointConfig.setting.clauses.list)
    }

    if (isLoading) {
        return <p className="p-4">Loading clauses data...</p>
    }
    if (clauseisLoading) {
        return <p className="p-4">Loading clauses data...</p>
    }

    return (
        <>
            <ClausesForm
                defaultValues={defaultValues}
                readOnly={isView}
                standardDetail={standard}
                categoryList={categoryList}
                documentList={documentList}
                onFormSubmit={handleSubmit}
            >
                <BottomPanel
                    isView={isView}
                    isSubmitting={isSubmitting}
                    isEdit={isEdit}
                    onDiscard={discard.show}
                />
            </ClausesForm>
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
                    be undo.{' '}
                </p>
            </ConfirmDialog>
        </>
    )
}

export default ClausesAddEdit
