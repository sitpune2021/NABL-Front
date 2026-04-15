/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import ClausesForm from '../Form'
import { ClausesFormSchema } from '@/schemas/clauses.schema'
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
import { flattenClauses } from '@/utils/flattenClauses'
import { StandardFormSchema } from '@/schemas/standard.schema'

const ClausesAddEdit = () => {
    const navigate = useNavigate()
    const { id } = useParams<{ id: string }>()
    const numericId = id ? Number(id) : undefined
    const location = useLocation()
    const mode = useMemo(() => getMode(location.pathname), [location.pathname])
    const isView = mode === 'view'
    const isEdit = mode === 'edit'

    const {
        clause,
        isLoading: isClauseLoading,
        mutate,
    } = useClauseDetail(numericId)
    const { standard, isLoading } = useStandardDetail(numericId)
    const { categoryList } = useCategoryList()
    const { documentList } = useDocumentList()
    const discard = useDiscardConfirm()

    const defaultValues = useMemo(() => {
        if (!standard) {
            return {
                standard_id: '',
                standard_clauses: [],
            }
        }

        if (clause) {
            const flatClauses = flattenClauses(clause.clauses)

            return {
                standard_id: clause.id,
                standard_clauses: flatClauses.map((c: any) => ({
                    clause_id: c.id,
                    clause_parent_id: c.parent_id,
                    notes: c.note_message ?? '',
                    clause_documents_tagging:
                        c.document_links?.length > 0
                            ? c.document_links.map((doc: any) => ({
                                  id: doc.id ?? '',
                                  category_id: doc.document.category_id ?? '',
                                  documents: {
                                      id: doc.document.id ?? '',
                                      version_id:
                                          doc.document.current_version?.id ??
                                          '',
                                      label: doc.document.name ?? '',
                                  },
                              }))
                            : [
                                  {
                                      category_id: '',
                                      documents: {
                                          id: '',
                                          version_id: '',
                                          label: '',
                                      },
                                  },
                              ],
                })),
            }
        }

        // ➕ CREATE MODE
        return {
            standard_id: (standard as StandardFormSchema & { id: string }).id,
            standard_clauses: flattenClauses(standard.clauses).map(
                (c: any) => ({
                    clause_id: c.id,
                    clause_parent_id: c.parent_id,
                    notes: '',
                    clause_documents_tagging: [
                        {
                            category_id: '',
                            documents: {
                                id: '',
                                version_id: '',
                                label: '',
                            },
                        },
                    ],
                }),
            ),
        }
    }, [clause, standard])

    const { save } = useEntityMutations<ClausesFormSchema>({
        apiCreate: apiCreateClauses,
        apiUpdate: apiUpdateClauses,
    })

    const { handleSubmit, isSubmitting } = useFormSubmit<ClausesFormSchema>({
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
        navigateTo: endpointConfig.setting.standard.list,
    })

    const confirmDiscard = () => {
        toast.push(
            <Notification type="success">Changes discarded</Notification>,
            { placement: 'top-center' },
        )
        discard.close()
        navigate(endpointConfig.setting.clauses.list)
    }

    if (isLoading || isClauseLoading) {
        return <p className="p-4">Loading clause data…</p>
    }

    if (!standard) return <></>

    return (
        <>
            <ClausesForm
                defaultValues={defaultValues}
                readOnly={isView}
                standard={standard}
                categoryList={categoryList}
                documentList={documentList}
                onSubmit={handleSubmit}
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
