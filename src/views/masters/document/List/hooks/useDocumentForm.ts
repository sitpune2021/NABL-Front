/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { DocumentFormSchema, documentFormSchema } from '@/@types/document'

export function useDocumentForm({
    defaultValues = {},
}: {
    defaultValues: any
}) {
    const methods = useForm<DocumentFormSchema>({
        mode: 'onSubmit',
        defaultValues: defaultValues,
        resolver: zodResolver(documentFormSchema) as any,
    })

    useEffect(() => {
        if (defaultValues && Object.keys(defaultValues).length > 0) {
            methods.reset(defaultValues)
        }
    }, [defaultValues])

    return methods
}
