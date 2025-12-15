/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useMemo, useCallback, useRef } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import sleep from '@/utils/sleep'
import endpointConfig from '@/configs/endpoint.config'
import useDocumentList from '../List/hooks/useList'
import DocumentForm from '../Form'
import {
    categorizeThDetails,
    type DocumentFormSchema,
    type FrequencyConfig,
} from '@/@types/document'
import { defaultDocumentValues } from '@/constants/intial-doc.constant'
import { apiGetDocumentEditortById } from '@/services/DocumentService'
import FrequencyPopup from '../Form/FrequencyPopup'
import DynamicFormWrapper from '../Form/DynamicWrapper'
import BottomPanel from '@/components/form/bottomPanel'

function buildPath(path: string, params: Record<string, string | number>) {
    return Object.entries(params).reduce(
        (acc, [key, value]) => acc.replace(`:${key}`, value.toString()),
        path,
    )
}

const DocumentAddEdit = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { id: documentId } = useParams()
    const { saveDocumentData, getDocumentById, saveDocumentEditorData } =
        useDocumentList()

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [documentData, setDocumentData] = useState<DocumentFormSchema | null>(
        null,
    )
    const [loadingData, setLoadingData] = useState(false)
    const [isFrequencyPopupOpen, setIsFrequencyPopupOpen] = useState(false)
    const [pendingSubmission, setPendingSubmission] = useState<{
        values: DocumentFormSchema
        isEditor: boolean
    } | null>(null)
    const [triates, setTriates] = useState<any>({ daily: [], oneTime: [] })

    const pathParts = location.pathname.split('/')
    const isEdit = pathParts.includes('edit')
    const isView = location.pathname.includes('/view')
    const isAdd = location.pathname.includes('/create')
    const isEditor = pathParts.includes('editor')
    const isDataEntry = pathParts.includes('data-entry')

    const didFetchRef = useRef(false)

    useEffect(() => {
        if (!documentId || didFetchRef.current) return

        didFetchRef.current = true

        const fetchData = async () => {
            setLoadingData(true)
            try {
                const data: any =
                    isEditor && (isEdit || isView)
                        ? await apiGetDocumentEditortById(documentId)
                        : await getDocumentById(documentId)
                setDocumentData(normalizeSavedDocument(data.data))
            } catch (err) {
                console.error('Failed to load document:', err)
                toast.push(
                    <Notification type="danger">
                        Failed to load document data.
                    </Notification>,
                    { placement: 'top-center' },
                )
            } finally {
                setLoadingData(false)
            }
        }

        fetchData()
    }, [documentId, isEditor, isEdit, isView])

    const defaultValues = useMemo(
        () => documentData ?? defaultDocumentValues,
        [documentData],
    )

    const normalizeSavedDocument = useCallback((doc: any) => {
        if (!doc) return doc

        const department = Array.isArray(doc.department)
            ? doc.department
            : doc.department
              ? [String(doc.department)]
              : undefined

        const rawJson = doc.editor?.document?.json ?? doc.document?.json
        let parsedJson: any = rawJson
        if (typeof rawJson === 'string') {
            try {
                parsedJson = JSON.parse(rawJson)
            } catch {
                parsedJson = rawJson
            }
        }

        const document = {
            html: doc.editor?.document?.html ?? doc.document?.html ?? '',
            css: doc.editor?.document?.css ?? doc.document?.css ?? '',
            js: doc.editor?.document?.js ?? doc.document?.js ?? '',
            json: parsedJson,
        }

        const normalized = {
            ...doc,
            department,
            document,
        }

        return normalized as DocumentFormSchema
    }, [])

    const performSubmission = async (
        values: DocumentFormSchema,
        isEditorMode: boolean,
    ) => {
        try {
            setIsSubmitting(true)
            const isUploadMode = values.mode === 'upload'
            if (isEditorMode) {
                const payload = isEdit ? { ...values, id: documentId } : values
                await saveDocumentEditorData(payload)
                await sleep(800)
                setIsSubmitting(false)
                toast.push(
                    <Notification type="success">
                        {isEdit ? 'Editor updated!' : 'Editor created!'}
                    </Notification>,
                    { placement: 'top-center' },
                )
                navigate(`${endpointConfig.master.document.list}`)
            } else {
                const payload = isEdit ? { ...values, id: documentId } : values
                const response = await saveDocumentData(payload)
                const savedDoc = response?.data
                await sleep(800)
                setIsSubmitting(false)
                toast.push(
                    <Notification type="success">
                        {isEdit ? 'Document updated!' : 'Document created!'}
                    </Notification>,
                    { placement: 'top-center' },
                )

                if (!isEdit && isUploadMode) {
                    if (!values.dataEntrySchedule) {
                        const normalized = normalizeSavedDocument(savedDoc)
                        setDocumentData(normalized)
                        setTriates(
                            categorizeThDetails(normalized.document?.json),
                        )
                        setPendingSubmission({
                            values: normalized,
                            isEditor: false,
                        })
                        setIsFrequencyPopupOpen(true)
                    } else {
                        navigate(endpointConfig.master.document.list)
                    }
                } else {
                    const path = isEdit
                        ? buildPath(endpointConfig.master.document.editorEdit, {
                              docId: documentId ?? '',
                              id: savedDoc.id ?? '',
                          })
                        : `${endpointConfig.master.document.editor}/${savedDoc.id}`
                    navigate(path)
                }
            }
        } catch (error) {
            console.error('Save failed:', error)
            toast.push(
                <Notification type="danger">
                    Failed to save document. Please try again.
                </Notification>,
                { placement: 'top-center' },
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleFormSubmit = useCallback(
        async (values: DocumentFormSchema) => {
            if (isView) return
            if (values.mode === 'upload' && !isEditor) {
                setTriates(categorizeThDetails(values.document?.json))
                setPendingSubmission({ values, isEditor: false })
                setIsFrequencyPopupOpen(true)
                return
            }

            if (isEditor && !isEdit && !values.dataEntrySchedule) {
                setTriates(categorizeThDetails(values.document?.json))
                setPendingSubmission({ values, isEditor: true })
                setIsFrequencyPopupOpen(true)
                return
            }

            if (isEditor && isEdit) {
                setTriates(categorizeThDetails(values.document?.json))
                setPendingSubmission({ values, isEditor: true })
                setIsFrequencyPopupOpen(true)
                return
            }

            await performSubmission(values, isEditor)
        },
        [isEdit, isView, isEditor, documentId],
    )

    const handleFrequencyConfirm = async (
        frequencyConfig: FrequencyConfig,
        settings: any,
    ) => {
        if (pendingSubmission) {
            const valuesWithFrequency = {
                ...pendingSubmission.values,
                dataEntrySchedule: {
                    frequency: frequencyConfig,
                    startDate: new Date().toISOString(),
                },
                settings: settings,
            }
            await performSubmission(
                valuesWithFrequency,
                pendingSubmission.isEditor,
            )
            setPendingSubmission(null)
        }
    }

    const handleDiscard = useCallback(() => setIsDialogOpen(true), [])
    const handleCancel = useCallback(() => setIsDialogOpen(false), [])
    const handleConfirmDiscard = useCallback(() => {
        toast.push(
            <Notification type="success">Changes discarded!</Notification>,
            { placement: 'top-center' },
        )
        setIsDialogOpen(false)
        navigate(endpointConfig.master.document.list)
    }, [navigate])

    if (loadingData && !isAdd) {
        return <p className="p-4 text-gray-600">Loading document data...</p>
    }

    if (isDataEntry && documentData?.settings) {
        return (
            <DynamicFormWrapper
                isDataEntry={isDataEntry}
                documentData={documentData}
            ></DynamicFormWrapper>
        )
    }
    return (
        <>
            <DocumentForm
                newDocument={isAdd}
                isEditor={isEditor}
                defaultValues={defaultValues}
                readOnly={isView}
                documentData={documentData}
                isEdit={isEdit}
                onFormSubmit={handleFormSubmit}
            >
                <BottomPanel
                    isView={isView}
                    isSubmitting={isSubmitting}
                    isEdit={isEdit}
                    isEditor={isEditor}
                    onDiscard={handleDiscard}
                />
            </DocumentForm>

            <FrequencyPopup
                isOpen={isFrequencyPopupOpen}
                initialData={documentData?.dataEntrySchedule?.frequency}
                initialSettings={documentData?.settings}
                triates={triates}
                onClose={() => {
                    setIsFrequencyPopupOpen(false)
                    setPendingSubmission(null)
                }}
                onConfirm={handleFrequencyConfirm}
            />

            <ConfirmDialog
                isOpen={isDialogOpen}
                type="danger"
                title="Discard changes"
                onClose={handleCancel}
                onCancel={handleCancel}
                onConfirm={handleConfirmDiscard}
            >
                <p>
                    Are you sure you want to discard this? This action can’t be
                    undone.
                </p>
            </ConfirmDialog>
        </>
    )
}

export default DocumentAddEdit
