import { useEffect } from 'react'
import { Form } from '@/components/ui/Form'
import Container from '@/components/shared/Container'
import BottomStickyBar from '@/components/template/BottomStickyBar'
import OverviewSection from './OverviewSection'
import isEmpty from 'lodash/isEmpty'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import type { CommonProps } from '@/@types/common'
import { DocumentFormSchema } from '@/@types/document'
import GrapesEditor from './GrapesEditor'

type DocumentFormProps = {
    onFormSubmit: (values: DocumentFormSchema) => void
    defaultValues?: DocumentFormSchema
    newDocument?: boolean
    readOnly?: boolean
    isEditor?: boolean
} & CommonProps

const validationSchema = z.object({
    labName: z.string().min(1, { message: 'Lab Name is required' }),
    location: z.string().optional(),
    department: z.string().optional(),
    header: z.string().optional(),
    footer: z.string().optional(),
    category: z.string().optional(),
    documentName: z.string().min(1, { message: 'Document Name is required' }),
    documentNo: z.string().optional(),
    issuedNo: z.string().optional(),
    amendmentNo: z.string().optional(),
    copyNo: z.string().optional(),
    date: z.string().optional(),
    preparedByDate: z.string().optional(),
    time: z.string().optional(),
    preparedBy: z.string().min(1, { message: 'Prepared By is required' }),
    quantityPrepared: z
        .union([z.string(), z.number()])
        .optional()
        .refine((val) => !val || Number(val) >= 0, {
            message: 'Quantity must be a positive number',
        }),
    approvedBy: z.string().min(1, { message: 'Approved By is required' }),
    issuedBy: z.string().optional(),
    issueDate: z.string().min(1, { message: 'Issue Date is required' }),
    amendmentDate: z.string().optional(),
    effectiveDate: z.string().min(1, { message: 'Effective Date is required' }),
    frequency: z.string().optional(),
    duration: z.string().optional(),
})

const DocumentForm = (props: DocumentFormProps) => {
    const {
        onFormSubmit,
        defaultValues = {},
        readOnly = false,
        children,
        isEditor,
    } = props

    const {
        handleSubmit,
        reset,
        formState: { errors },
        control,
    } = useForm<DocumentFormSchema>({
        defaultValues: {
            ...defaultValues,
        },
        resolver: zodResolver(validationSchema),
    })

    useEffect(() => {
        if (!isEmpty(defaultValues)) {
            reset(defaultValues)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(defaultValues)])

    const onSubmit = (values: DocumentFormSchema) => {
        onFormSubmit?.(values)
    }

    return (
        <Form
            className="flex w-full h-full"
            containerClassName="flex flex-col w-full justify-between"
            onSubmit={handleSubmit(onSubmit)}
        >
            <Container>
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="gap-4 flex flex-col flex-auto">
                        {isEditor ? (
                            <GrapesEditor
                                control={control}
                                errors={errors}
                                readOnly={readOnly}
                                dialogIsOpen={false}
                                isSubmiting={true}
                                isEdit={false}
                                onDialogClose={() => {}}
                            />
                        ) : (
                            <OverviewSection
                                control={control}
                                errors={errors}
                                readOnly={readOnly}
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
