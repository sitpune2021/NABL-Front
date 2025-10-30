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
    required: false,
    timezone: false,
}

const mapStandardsToTitleData = (
    standards: any[],
    parentKey = '',
): TitleSpecificData[] => {
    const result: TitleSpecificData[] = []
    standards.forEach((item, idx) => {
        const key = `${parentKey}${idx}-${item.title}`

        if (item.note) {
            result.push({
                titleKey: key,
                notes: [''],
                clauses: [{ ...defaultClause }],
                title: '',
            })
        }

        if (item.children && item.children.length > 0) {
            result.push(...mapStandardsToTitleData(item.children, key + '-'))
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
    const {
        handleSubmit,
        reset,
        formState: { errors },
        control,
        setValue,
        getValues,
    } = useForm<ClausesFormSchema>({
        defaultValues: {
            titleSpecificData: [],
        },
    })
    const { id: standardId } = useParams()

    const [accordionData, setAccordionData] = useState<any[]>([])

    useEffect(() => {
        const fetchData = async () => {
            console.log('ClausesForm - defaultValues:', defaultValues)

            if (!isEmpty(defaultValues?.titleSpecificData)) {
                console.log('ClausesForm - Using existing titleSpecificData')
                reset(defaultValues)
                return
            }

            if (!standardId) {
                console.warn(
                    'ClausesForm - standardId is undefined, skipping fetch',
                )
                return
            }

            try {
                const data: any = await apiGetStandardById(standardId)
                setAccordionData(data.standards)
                const mappedTitleData = mapStandardsToTitleData(data.standards)
                reset({ titleSpecificData: mappedTitleData })
            } catch (err) {
                console.error('Failed to fetch standard:', err)
            }
        }

        fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(defaultValues), reset, standardId])

    const onSubmit = (values: ClausesFormSchema) => {
        const cleanedData: ClausesFormSchema = {
            ...values,
            titleSpecificData: values.titleSpecificData
                .map((titleData) => ({
                    ...titleData,
                    notes: titleData.notes.filter((note) => note.trim() !== ''),
                    clauses: titleData.clauses.filter(
                        (clause) =>
                            clause.category.trim() !== '' ||
                            clause.documentName.trim() !== '' ||
                            clause.frequency.trim() !== '',
                    ),
                }))
                .filter(
                    (titleData) =>
                        titleData.notes.length > 0 ||
                        titleData.clauses.length > 0,
                ),
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
                        <OverviewSection
                            control={control}
                            errors={errors}
                            readOnly={readOnly}
                            setValue={setValue}
                            getValues={getValues}
                            accordionData={accordionData} // ✅ correct reference
                        />
                    </div>
                </div>
            </Container>
            <BottomStickyBar>{children}</BottomStickyBar>
        </Form>
    )
}

export default ClausesForm
