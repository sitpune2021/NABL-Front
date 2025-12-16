/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form } from '@/components/ui/Form'
import Container from '@/components/shared/Container'
import BottomStickyBar from '@/components/template/BottomStickyBar'
import OverviewSection from './OverviewSection'
import { useForm } from 'react-hook-form'
import type { CommonProps } from '@/@types/common'
import { Card } from '@/components/ui'
import { Standard } from '@/@types/standard'
import { Category } from '@/@types/category'
import { Document } from '@/@types/document'
// import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

// Schema for a document assigned to a clause
const ClauseDocumentSchema = z.object({
    id: z.string().min(1, 'Document ID is required'),
    version_id: z.string().min(1, 'Version ID is required'),
    label: z.string().optional(),
})

// Schema for each clause's document tagging
const ClauseDocumentTaggingSchema = z.object({
    category_id: z.string().min(1, 'Category is required'),
    documents: ClauseDocumentSchema,
})

// Schema for each standard clause
const StandardClauseSchema = z.object({
    clause_id: z.string().min(1),
    clause_parent_id: z.string().optional(),
    notes: z.string(),
    clause_documents_tagging: z
        .array(ClauseDocumentTaggingSchema)
        .min(1, 'At least one document must be assigned to the clause'),
})

// Full form schema
export const ClausesFormSchema = z.object({
    standard_clauses: z
        .array(StandardClauseSchema)
        .min(1, 'At least one clause is required'),
})

// Type inference
export type ClausesFormSchema = z.infer<typeof ClausesFormSchema>

type ClausesFormProps = {
    onFormSubmit: (values: ClausesFormSchema) => void
    defaultValues?: Partial<ClausesFormSchema>
    newClauses?: boolean
    readOnly?: boolean
    standardDetail: Standard
    categoryList: Category[]
    documentList: Document[]
} & CommonProps

const ClausesForm = ({
    onFormSubmit,
    readOnly = false,
    children,
    standardDetail,
    documentList,
    categoryList,
}: ClausesFormProps) => {
    const defaultValuesWithDocs = {
        standard_clauses: standardDetail.clauses.map((clause: any) => ({
            clause_id: clause.id,
            clause_parent_id: clause.parent_id,
            notes: '',
            clause_documents_tagging: clause.clause_documents_tagging?.length
                ? clause.clause_documents_tagging
                : [
                      {
                          category_id: '',
                          documents: {
                              id: '',
                              version_is: '',
                              version: '',
                              frequench: '',
                          },
                      },
                  ],
        })),
    }

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: defaultValuesWithDocs,
        // resolver: zodResolver(ClausesFormSchema),
    })

    const onSubmit = (values: ClausesFormSchema) => {
        console.log(values)
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
                        <Card>
                            <h4 className="text-lg font-semibold">
                                {standardDetail.name}
                            </h4>
                        </Card>
                        <OverviewSection
                            control={control}
                            errors={errors}
                            readOnly={readOnly}
                            accordionData={standardDetail.clauses || []}
                            documentList={documentList}
                            categoryList={categoryList}
                        />
                    </div>
                </div>
            </Container>
            <BottomStickyBar>{children}</BottomStickyBar>
        </Form>
    )
}

export default ClausesForm
