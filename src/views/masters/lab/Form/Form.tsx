/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import { Form, FormItem } from '@/components/ui/Form'
import Container from '@/components/shared/Container'
import BottomStickyBar from '@/components/template/BottomStickyBar'
import OverviewSection from './OverviewSection'
import isEmpty from 'lodash/isEmpty'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, FormProvider, Controller } from 'react-hook-form'
import type { CommonProps } from '@/@types/common'
import LocationsSection from './LocationsSection'
import ClauseTree from './ClauseTree'
import { labSchema, LabFormSchema } from '@/schemas/lab.schema'
import { useStandardClauseList } from '../../instrument/List/hooks/useSTDClause'
import { Card, Select } from '@/components/ui'

type LabFormProps = {
    onFormSubmit: (values: LabFormSchema) => void
    defaultValues?: LabFormSchema
    newLab?: boolean
    readOnly?: boolean
    zoneList: any[]
    clusterList: any[]
    locationList: any[]
    departmentList: any[]
    instrumentList: any[]
    documentList: any[]
} & CommonProps

const LabForm = ({
    onFormSubmit,
    defaultValues,
    readOnly = false,
    children,
    zoneList,
    clusterList,
    locationList,
    departmentList,
    instrumentList,
    documentList,
}: LabFormProps) => {
    const methods = useForm<LabFormSchema>({
        defaultValues,
        resolver: zodResolver(labSchema),
    })

    const { ClauseDocumentList, isLoading } = useStandardClauseList('current')
    const [selectedClauses, setSelectedClauses] = useState<string[]>([])

    const {
        handleSubmit,
        reset,
        control,
        formState: { errors },
        setValue,
    } = methods

    useEffect(() => {
        if (!isEmpty(defaultValues)) {
            reset(defaultValues)
        }
    }, [defaultValues])

    useEffect(() => {
        if (!isEmpty(defaultValues)) {
            reset(defaultValues)
            if ((defaultValues as any).selectedClauses) {
                setSelectedClauses((defaultValues as any).selectedClauses)
            }
        }
    }, [defaultValues])

    const onSubmit = (values: LabFormSchema) => {
        const payload = {
            ...values,
            selectedClauses,
            standard_id: ClauseDocumentList.id, // Or pick dynamically if multiple standards
        }
        onFormSubmit?.(payload)
    }

    if (isLoading) {
        return <>loading.....</>
    }

    return (
        <FormProvider {...methods}>
            <Form
                className="flex w-full h-full"
                containerClassName="flex flex-col w-full justify-between"
                onSubmit={handleSubmit(onSubmit as unknown as any)}
            >
                <Container>
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="gap-4 flex flex-col flex-auto">
                            <OverviewSection
                                control={control}
                                errors={errors}
                                readOnly={readOnly}
                                setValue={setValue}
                            />
                            <LocationsSection
                                control={control}
                                errors={errors}
                                readOnly={readOnly}
                                zoneList={zoneList}
                                clusterList={clusterList}
                                locationList={locationList}
                                departmentList={departmentList}
                                instrumentList={instrumentList}
                            />
                            <ClauseTree
                                data={ClauseDocumentList.clauses}
                                selectedItems={selectedClauses} // optional if you want controlled selection
                                onSelectionChange={(selected) =>
                                    setSelectedClauses(selected)
                                }
                            />
                            <Card>
                                <FormItem
                                    label="Documents"
                                    invalid={!!errors.documents}
                                    errorMessage={errors.documents?.message}
                                >
                                    <Controller
                                        name={`documents`}
                                        defaultValue={documentList.map(
                                            (i) => i.id,
                                        )} // <-- select all by default
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                isMulti
                                                placeholder="Select Documents"
                                                options={documentList.map(
                                                    (i) => ({
                                                        label: i.name,
                                                        value: i.id,
                                                    }),
                                                )}
                                                value={documentList
                                                    .map((i) => ({
                                                        label: i.name,
                                                        value: i.id,
                                                    }))
                                                    .filter((opt) =>
                                                        field.value?.includes(
                                                            opt.value,
                                                        ),
                                                    )}
                                                isDisabled={readOnly}
                                                onChange={(selected) =>
                                                    field.onChange(
                                                        selected?.map(
                                                            (s) => s.value,
                                                        ) || [],
                                                    )
                                                }
                                            />
                                        )}
                                    />
                                </FormItem>
                            </Card>
                        </div>
                    </div>
                </Container>

                <BottomStickyBar>{children}</BottomStickyBar>
            </Form>
        </FormProvider>
    )
}

export default LabForm
