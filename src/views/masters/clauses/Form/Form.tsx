/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import { Form } from '@/components/ui/Form'
import Container from '@/components/shared/Container'
import BottomStickyBar from '@/components/template/BottomStickyBar'
import OverviewSection from './OverviewSection'
import isEmpty from 'lodash/isEmpty'
import { useForm } from 'react-hook-form'
import type { CommonProps } from '@/@types/common'
import { ClausesFormSchema, TitleSpecificData } from '@/@types/clauses'
import { apiGetStandardById } from '@/services/StandardService'
import { useParams } from 'react-router'
import { Card } from '@/components/ui'

type ClausesFormProps = {
    onFormSubmit: (values: ClausesFormSchema) => void
    defaultValues?: Partial<ClausesFormSchema>
    newClauses?: boolean
    readOnly?: boolean
} & CommonProps

const defaultClause = {
    category: '',
    documentName: '',
    frequency: '',
}

const mapStandardsToClauseDocumentsData = (
    standards: any[],
): TitleSpecificData[] => {
    const result: TitleSpecificData[] = []

    standards.forEach((item) => {
        if (item.note) {
            result.push({
                id: item.id,
                parentId: item.parent_id,
                notes: '',
                clauses: [{ ...defaultClause }],
            })
        }

        if (item.children?.length > 0) {
            result.push(...mapStandardsToClauseDocumentsData(item.children))
        }
    })
    return result
}

const ClausesForm = ({
    onFormSubmit,
    defaultValues = {},
    readOnly = false,
    children,
}: ClausesFormProps) => {
    const { id: standardId } = useParams()
    const {
        handleSubmit,
        reset,
        formState: { errors },
        control,
        setValue,
        getValues,
    } = useForm<ClausesFormSchema>({
        defaultValues: {
            Standard_id: standardId,
            clause_documents: [],
        },
    })

    const [accordionData, setAccordionData] = useState<any[]>([])
    const [name, setName] = useState<any>('')

    useEffect(() => {
        const fetchData = async () => {
            if (!isEmpty(defaultValues?.clause_documents)) {
                reset(defaultValues)
                return
            }

            if (!standardId) return

            try {
                const data: any = await apiGetStandardById(standardId)
                setName(data.name)
                setAccordionData(data.clauses)
                const mappedData = mapStandardsToClauseDocumentsData(
                    data.clauses,
                )
                reset({ clause_documents: mappedData })
            } catch (err) {
                console.error('Failed to fetch standard:', err)
            }
        }

        fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(defaultValues), reset, standardId])

    const onSubmit = (values: ClausesFormSchema) => {
        const cleanedData = {
            ...values,
            clause_documents: values.clause_documents
                .map((doc) => ({
                    ...doc,
                    clauses: doc.clauses.filter(
                        (c) =>
                            c.category.trim() !== '' ||
                            c.documentName.trim() !== '' ||
                            c.frequency.trim() !== '',
                    ),
                }))
                .filter((doc) => doc.clauses.length > 0),
        }

        onFormSubmit?.(cleanedData)
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
                            <h4 className="text-lg font-semibold">{name}</h4>
                        </Card>
                        <OverviewSection
                            control={control}
                            errors={errors}
                            readOnly={readOnly}
                            setValue={setValue}
                            getValues={getValues}
                            accordionData={accordionData}
                        />
                    </div>
                </div>
            </Container>
            <BottomStickyBar>{children}</BottomStickyBar>
        </Form>
    )
}

export default ClausesForm
