/* eslint-disable @typescript-eslint/no-explicit-any */
import Container from '@/components/shared/Container'
import BottomStickyBar from '@/components/template/BottomStickyBar'
import GrapesEditor from './GrapesEditor'
import OverviewSection from './OverviewSection'
import { Form } from '@/components/ui/Form'
import { useDocumentForm } from '../List/hooks/useDocumentForm'
import { DocumentFormSchema, EditorFormSchema } from '@/@types/document'
import { CommonProps } from '@/@types/common'

type DocumentFormProps = {
    onFormSubmit: (values: DocumentFormSchema & EditorFormSchema) => void
    defaultValues?: Partial<DocumentFormSchema> & Partial<EditorFormSchema>
    newDocument?: boolean
    readOnly?: boolean
    isEditor?: boolean
    documentData?: DocumentFormSchema | null
    isEdit?: boolean
} & CommonProps

export default function DocumentForm({
    onFormSubmit,
    defaultValues = {},
    readOnly = false,
    isEditor = false,
    isEdit = false,
    documentData,
    children,
}: DocumentFormProps) {
    const methods = useDocumentForm({
        defaultValues,
        isEditor,
        isEdit,
    })

    const { handleSubmit, formState, control, setValue } = methods
    const { errors } = formState

    return (
        <Form
            className="flex w-full h-full"
            containerClassName="flex flex-col w-full justify-between"
            onSubmit={handleSubmit(onFormSubmit as any)}
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
