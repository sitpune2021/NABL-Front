import { useEffect } from 'react'
import { Form } from '@/components/ui/Form'
import Container from '@/components/shared/Container'
import BottomStickyBar from '@/components/template/BottomStickyBar'
import OverviewSection from './OverviewSection'
import isEmpty from 'lodash/isEmpty'
import { useForm } from 'react-hook-form'
import type { CommonProps } from '@/@types/common'
import { ClausesFormSchema, TitleSpecificData } from '@/@types/clauses'
import { accordionData, AccordionItem } from '@/mock/data/clausesData'

type ClausesFormProps = {
    onFormSubmit: (values: ClausesFormSchema) => void
    defaultValues?: Partial<ClausesFormSchema>
    newClauses?: boolean
    readOnly?: boolean
} & CommonProps

const ClausesForm = (props: ClausesFormProps) => {
    const {
        onFormSubmit,
        defaultValues = {},
        readOnly = false,
        children,
    } = props

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

    useEffect(() => {
        const initializeTitleData = (
            items: AccordionItem[],
            parentKey = '',
        ): TitleSpecificData[] => {
            let allData: TitleSpecificData[] = []

            items.forEach((item, idx) => {
                const key = `${parentKey}${idx}-${item.title}`
                allData.push({
                    titleKey: key,
                    title: item.title,
                    notes: [''],
                    clauses: [
                        {
                            category: '',
                            documentName: '',
                            frequency: '',
                            required: false,
                            timezone: false,
                        },
                    ],
                })

                // Add children recursively
                if (item.children && item.children.length > 0) {
                    allData = [
                        ...allData,
                        ...initializeTitleData(item.children, key + '-'),
                    ]
                }
            })

            return allData
        }

        console.log('ClausesForm - defaultValues:', defaultValues)

        if (!isEmpty(defaultValues) && defaultValues.titleSpecificData) {
            // If editing/viewing, use existing data (from URL or API)
            console.log('ClausesForm - Using existing titleSpecificData')
            reset(defaultValues)
        } else {
            // If new, initialize from accordion structure
            console.log('ClausesForm - Initializing default titleSpecificData')
            const initialTitleData = initializeTitleData(accordionData)
            reset({ titleSpecificData: initialTitleData })
        }
    }, [JSON.stringify(defaultValues), reset])

    const onSubmit = (values: ClausesFormSchema) => {
        console.log('Form submitted:', values)

        //  Filter out completely empty data before submitting
        const cleanedData = {
            ...values,
            titleSpecificData: values.titleSpecificData
                .map((titleData) => ({
                    ...titleData,
                    // Remove empty notes
                    notes: titleData.notes.filter((note) => note.trim() !== ''),
                    // Remove completely empty clauses
                    clauses: titleData.clauses.filter(
                        (clause) =>
                            clause.category.trim() !== '' ||
                            clause.documentName.trim() !== '' ||
                            clause.frequency.trim() !== '',
                    ),
                }))
                .filter(
                    (titleData) =>
                        // Keep only titles that have some data
                        titleData.notes.length > 0 ||
                        titleData.clauses.length > 0,
                ),
        }

        console.log('Cleaned data for submission:', cleanedData)
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
                        />
                    </div>
                </div>
            </Container>
            <BottomStickyBar>{children}</BottomStickyBar>
        </Form>
    )
}

export default ClausesForm
