/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react'
import { Form } from '@/components/ui/Form'
import Container from '@/components/shared/Container'
import BottomStickyBar from '@/components/template/BottomStickyBar'
import OverviewSection from './OverviewSection'
import { FormProvider, useForm } from 'react-hook-form'

import type { CommonProps } from '@/@types/common'
import { Card } from '@/components/ui'
import { StandardFormSchema } from '@/schemas/standard.schema'
import { Category } from '@/@types/category'
import { Document } from '@/@types/document'
import { zodResolver } from '@hookform/resolvers/zod'
import { ClausesFormSchema, ClausesSchema } from '@/schemas/clauses.schema'

type ClausesFormProps = {
    onSubmit: (values: ClausesFormSchema) => void
    defaultValues: ClausesFormSchema
    readOnly?: boolean
    standard: StandardFormSchema
    categoryList: Category[]
    documentList: Document[]
} & CommonProps

const ClausesForm = ({
    onSubmit,
    defaultValues,
    readOnly = false,
    children,
    standard,
    documentList,
    categoryList,
}: ClausesFormProps) => {
    const methods = useForm<ClausesFormSchema>({
        resolver: zodResolver(ClausesSchema) as any,
        mode: 'onSubmit',
        reValidateMode: 'onChange',
    })

    // ✅ Initialize / update form when defaults change
    useEffect(() => {
        if (defaultValues?.standard_clauses?.length) {
            methods.reset(defaultValues)
        }
    }, [defaultValues, methods])

    return (
        <FormProvider {...methods}>
            <Form
                className="flex w-full h-full"
                containerClassName="flex flex-col w-full justify-between"
                onSubmit={methods.handleSubmit(onSubmit as any)}
            >
                <Container>
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="gap-4 flex flex-col flex-auto">
                            <Card>
                                <h4 className="text-lg font-semibold">
                                    {standard.name}
                                </h4>
                            </Card>

                            <OverviewSection
                                standardId={
                                    (
                                        standard as StandardFormSchema & {
                                            id: string
                                        }
                                    ).id
                                }
                                readOnly={readOnly}
                                accordionData={standard.clauses}
                                documentList={documentList}
                                categoryList={categoryList}
                            />
                        </div>
                    </div>
                </Container>

                <BottomStickyBar>{children}</BottomStickyBar>
            </Form>
        </FormProvider>
    )
}

export default ClausesForm
