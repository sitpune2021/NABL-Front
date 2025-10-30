import { useEffect, useMemo } from 'react'
import { Form } from '@/components/ui/Form'
import Container from '@/components/shared/Container'
import BottomStickyBar from '@/components/template/BottomStickyBar'
import OverviewSection from './OverviewSection'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import type { CommonProps } from '@/@types/common'
import type { DocumentFormSchema, EditorFormSchema } from '@/@types/document'
import GrapesEditor from './GrapesEditor'
import { useParams } from 'react-router'

type DocumentFormProps = {
    onFormSubmit: (values: DocumentFormSchema & EditorFormSchema) => void
    defaultValues?: Partial<DocumentFormSchema> & Partial<EditorFormSchema>
    newDocument?: boolean
    readOnly?: boolean
    isEditor?: boolean
    documentData?: DocumentFormSchema | null
    isEdit?: boolean
} & CommonProps
const validationSchema = z.object({
    labName: z.string().min(1, 'Lab Name is required'),
    location: z.string().optional(),
    department: z.array(z.string()).optional(),
    header: z.union([z.string(), z.number()]).optional(),
    footer: z.union([z.string(), z.number()]).optional(),
    category: z.string().optional(),
    documentName: z.string().min(1, 'Document Name is required'),
    documentNo: z.string().optional(),
    issuedNo: z.string().optional(),
    amendmentNo: z.string().optional(),
    copyNo: z.string().optional(),
    date: z.string().optional(),
    preparedByDate: z.string().optional(),
    time: z.string().optional(),
    preparedBy: z.string().min(1, 'Prepared By is required'),
    quantityPrepared: z
        .union([z.string(), z.number()])
        .optional()
        .refine((val) => !val || Number(val) >= 0, {
            message: 'Quantity must be a positive number',
        }),
    approvedBy: z.string().min(1, 'Approved By is required'),
    issuedBy: z.string().optional(),
    issueDate: z.string().min(1, 'Issue Date is required'),
    amendmentDate: z.string().optional(),
    effectiveDate: z.string().min(1, 'Effective Date is required'),
    frequency: z.string().optional(),
    duration: z.string().optional(),
    prefix: z.string().optional(),
    status: z.enum(['Controlled', 'Uncontrolled']).optional(),
})

const editorSchema = z.object({
    documentId: z.string().min(1, 'Document ID is required'),
    document: z.any(),
})

const DocumentForm = ({
    onFormSubmit,
    defaultValues = {},
    readOnly = false,
    children,
    isEditor = false,
    isEdit = false,
    documentData,
}: DocumentFormProps) => {
    const { id: documentId } = useParams()

    const formMethods = useForm<DocumentFormSchema | EditorFormSchema>({
        defaultValues: isEditor
            ? isEdit
                ? ({
                      documentId: documentId ?? '',
                      document: defaultValues.document,
                  } as EditorFormSchema)
                : ({
                      documentId: documentId ?? '',
                      document: {
                          html: '',
                          css: '',
                      },
                  } as EditorFormSchema)
            : (defaultValues as DocumentFormSchema),
        /* eslint-disable @typescript-eslint/no-explicit-any */
        resolver: zodResolver(
            isEditor ? editorSchema : validationSchema,
        ) as any,
    })

    const { handleSubmit, reset, formState, control, setValue } = formMethods
    const { errors } = formState
    const memoizedDefaults = useMemo(() => defaultValues, [defaultValues])

    useEffect(() => {
        if (memoizedDefaults && Object.keys(memoizedDefaults).length > 0) {
            reset(memoizedDefaults)
        }
    }, [memoizedDefaults, reset])

    const onSubmit = (values: DocumentFormSchema | EditorFormSchema) => {
        onFormSubmit?.(values as DocumentFormSchema & EditorFormSchema)
    }

    return (
        <Form
            className="flex w-full h-full"
            containerClassName="flex flex-col w-full justify-between"
            onSubmit={handleSubmit(onSubmit)}
        >
            <Container>
                <div className="flex flex-col md:flex-row gap-4">
                    <div
                        className={`flex flex-col flex-auto gap-4 ${isEditor ? 'items-center' : ''}`}
                    >
                        {isEditor ? (
                            <GrapesEditor
                                control={control}
                                errors={errors}
                                readOnly={readOnly}
                                setValue={setValue}
                                documentData={documentData}
                                isEdit={isEdit}
                            />
                        ) : (
                            <OverviewSection
                                control={control}
                                errors={errors}
                                readOnly={readOnly}
                                setValue={setValue}
                            />
                        )}
                    </div>
                </div>
            </Container>
            <BottomStickyBar>{children}</BottomStickyBar>
        </Form>
    )
}

export default DocumentForm
