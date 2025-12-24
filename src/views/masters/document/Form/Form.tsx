/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { Form } from '@/components/ui/Form'
import Container from '@/components/shared/Container'
import BottomStickyBar from '@/components/template/BottomStickyBar'
import { Button } from '@/components/ui'
import GrapesEditor from './GrapesEditor'
import OverviewSection from './OverviewSection'
import FrequencyPopup from './FrequencyPopup'
import { useDocumentForm } from '../List/hooks/useDocumentForm'
import PageContainer from '@/components/template/PageContainer'
import { useCategoryList } from '../../category/List/hooks/useList'
import useDepartmentList from '../../department/List/hooks/useList'
import useTemplateList from '../../template/List/hooks/useList'
import { DocumentFormSchema, EditorFormSchema } from '@/@types/document'

type DocumentFormProps = {
    onFormSubmit: (values: DocumentFormSchema & EditorFormSchema) => void
    defaultValues?: Partial<DocumentFormSchema>
    readOnly?: boolean
    isEdit?: boolean
    isForEditor?: boolean
}

export default function DocumentForm({
    onFormSubmit,
    defaultValues = {},
    readOnly = false,
    isEdit = false,
    isForEditor,
}: DocumentFormProps) {
    const [step, setStep] = useState(0)
    const [showFrequencyPopup, setShowFrequencyPopup] = useState(false)

    const { categoryList } = useCategoryList()
    const { departmentList } = useDepartmentList()
    const { templateList, getTemplateById } = useTemplateList()
    const { handleSubmit, formState, control, setValue, trigger, getValues } =
        useDocumentForm({ defaultValues })
    const { errors } = formState

    const goNext = async () => {
        if (step === 0) {
            const valid = await trigger([
                'mode',
                'category_id',
                'department',
                'number',
                'name',
                'status',
                'header',
                'footer',
                'copy_no',
                'quantity_prepared',
                'workflow_state',
                'step_type',
                'performed_by',
                'performed_date',
                'effective_date',
                'review_frequency',
            ])
            if (!valid) return

            getValues('mode') === 'create'
                ? setStep(1)
                : setShowFrequencyPopup(true)
        } else if (step === 1) {
            setShowFrequencyPopup(true)
        }
    }

    const goPrev = () => setStep((prev) => Math.max(prev - 1, 0))
    const handlePopupClose = () => setShowFrequencyPopup(false)

    const handleFrequencyConfirm = async () => {
        // 🔥 Trigger full form validation
        const isValid = await trigger()
        if (!isValid) {
            return
        }
        setShowFrequencyPopup(false)
        handleSubmit(onFormSubmit as any)()
    }

    if (isForEditor && readOnly) {
        return (
            <GrapesEditor
                control={control}
                errors={errors}
                readOnly={readOnly}
                setValue={setValue}
                isEdit={isEdit}
                getTemplateById={getTemplateById}
            />
        )
    }

    return (
        <Form
            className="flex w-full h-full"
            containerClassName="flex flex-col w-full justify-between"
        >
            <Container>
                <div className="flex flex-col md:flex-row gap-4">
                    {step === 0 && (
                        <OverviewSection
                            control={control}
                            errors={errors}
                            readOnly={readOnly}
                            setValue={setValue}
                            categoryList={categoryList}
                            departmentList={departmentList}
                            templateList={templateList}
                            isEdit={isEdit}
                        />
                    )}

                    {step === 1 && getValues('mode') === 'create' && (
                        <div className="flex flex-col flex-auto gap-4">
                            <PageContainer
                                pageContainerType="gutterless"
                                pageBackgroundType="plain"
                                footer={false}
                                layout="blank"
                            >
                                <GrapesEditor
                                    control={control}
                                    errors={errors}
                                    readOnly={readOnly}
                                    setValue={setValue}
                                    isEdit={isEdit}
                                    getTemplateById={getTemplateById}
                                />
                            </PageContainer>
                        </div>
                    )}

                    {showFrequencyPopup && (
                        <FrequencyPopup
                            isOpen={showFrequencyPopup}
                            control={control}
                            errors={errors}
                            readOnly={readOnly}
                            setValue={setValue}
                            onClose={handlePopupClose}
                            onConfirm={handleFrequencyConfirm}
                        />
                    )}
                </div>
            </Container>

            {!showFrequencyPopup && (
                <BottomStickyBar>
                    <Button
                        type="button"
                        disabled={step === 0}
                        onClick={goPrev}
                    >
                        Previous
                    </Button>
                    {step < 1 ? (
                        <Button type="button" variant="solid" onClick={goNext}>
                            Next
                        </Button>
                    ) : (
                        <Button
                            type="button"
                            variant="solid"
                            onClick={() => setShowFrequencyPopup(true)}
                        >
                            Submit
                        </Button>
                    )}
                </BottomStickyBar>
            )}
        </Form>
    )
}
