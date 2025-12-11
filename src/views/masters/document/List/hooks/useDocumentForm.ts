/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useParams } from 'react-router'
import {
    DocumentFormSchema,
    documentFormSchema,
    EditorFormSchema,
    editorSchema,
} from '@/@types/document'

export function useDocumentForm({
    defaultValues = {},
    isEditor,
    isEdit,
}: {
    defaultValues: any
    isEditor: boolean
    isEdit: boolean
}) {
    const { id: documentId } = useParams()

    const resolvedSchema = isEditor ? editorSchema : documentFormSchema

    const initialDefaults = useMemo(() => {
        if (!isEditor) return defaultValues
        return isEdit
            ? {
                  documentId: documentId ?? '',
                  document: defaultValues.document,
              }
            : {
                  documentId: documentId ?? '',
                  document: { html: '', css: '', json: '' },
              }
    }, [defaultValues, isEditor, isEdit, documentId])

    const methods = useForm<DocumentFormSchema | EditorFormSchema>({
        mode: 'onSubmit',
        defaultValues: initialDefaults,
        resolver: zodResolver(resolvedSchema) as any,
    })

    useEffect(() => {
        if (defaultValues && Object.keys(defaultValues).length > 0) {
            methods.reset(defaultValues)
        }
    }, [defaultValues])

    return methods
}
