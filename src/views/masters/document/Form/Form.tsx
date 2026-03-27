import { useCallback, useEffect, useMemo, useState } from 'react'
import { FormProvider, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Form } from '@/components/ui/Form'
import Container from '@/components/shared/Container'
import BottomStickyBar from '@/components/template/BottomStickyBar'
import { Button } from '@/components/ui'

import EditorSection from './EditorSection'
import DocumentInformationSection from './DocumentInformationSection'
import FrequencySection from './FrequencySection'
import PageContainer from '@/components/template/PageContainer'

import { useCategoryList } from '../../category/List/hooks/useList'
import useDepartmentList from '../../department/List/hooks/useList'
import useTemplateList from '../../template/List/hooks/useList'

import { DocumentFormSchema, documentSchema } from '@/schemas/document.schema'
import { EMPTY_VALUES, STEP_ONE_FIELDS } from '@/constants/document.constant'

import { TbArrowNarrowLeft, TbArrowNarrowRight } from 'react-icons/tb'
import { DocumentFormProps } from '@/@types/document'

export default function DocumentForm({
    onFormSubmit,
    defaultValues,
    readOnly = false,
    isEdit = false,
    isForEditor = false,
    isForEditorView = false,
    loading = false,
    isSubmitting = false,
}: DocumentFormProps) {
    const memoizedDefaults = useMemo(
        () => defaultValues ?? EMPTY_VALUES,
        [defaultValues],
    )

    const methods = useForm<DocumentFormSchema>({
        resolver: zodResolver(documentSchema),
        defaultValues: memoizedDefaults,
        mode: 'onSubmit',
        reValidateMode: 'onChange',
    })

    const {
        handleSubmit,
        trigger,
        reset,
        control,
        setValue,
        formState: { errors },
    } = methods

    useEffect(() => {
        if (defaultValues) {
            reset(defaultValues)
        }
    }, [defaultValues, reset])

    const [step, setStep] = useState(0)
    const [showFrequencyPopup, setShowFrequencyPopup] = useState(false)

    const mode = useWatch({ control, name: 'mode' })

    const { categoryList } = useCategoryList()
    const { departmentList } = useDepartmentList()
    const { templateList, getTemplateById } = useTemplateList()

    const goNext = useCallback(async () => {
        if (step === 0) {
            const valid = await trigger(STEP_ONE_FIELDS)
            if (!readOnly) if (!valid) return

            mode === 'create' ? setStep(1) : setShowFrequencyPopup(true)
        } else {
            setShowFrequencyPopup(true)
        }
    }, [step, trigger, mode])

    const goPrev = useCallback(() => {
        setStep((prev) => Math.max(prev - 1, 0))
    }, [])

    const handleBack = useCallback(() => {
        window.history.back()
    }, [])

    const handleFrequencyConfirm = useCallback(async () => {
        const isValid = await trigger()
        if (!isValid) return

        setShowFrequencyPopup(false)
        handleSubmit(onFormSubmit)()
    }, [handleSubmit, onFormSubmit, trigger])

    if (isForEditor || isForEditorView) {
        return (
            <EditorSection
                control={control}
                setValue={setValue}
                errors={errors}
                readOnly={isForEditorView}
                isEdit={isEdit}
                getTemplateById={getTemplateById}
                defaultValues={defaultValues}
                loading={loading}
            />
        )
    }

    return (
        <FormProvider {...methods}>
            <Form
                className="flex w-full h-full"
                containerClassName="flex flex-col w-full justify-between"
            >
                <Container>
                    <div className="flex flex-col md:flex-row gap-4">
                        {step === 0 && (
                            <DocumentInformationSection
                                readOnly={readOnly && loading}
                                categoryList={categoryList}
                                departmentList={departmentList}
                                templateList={templateList}
                                isEdit={isEdit}
                            />
                        )}

                        {step === 1 && mode === 'create' && (
                            <div className="flex flex-col flex-auto gap-4">
                                <PageContainer
                                    pageContainerType="gutterless"
                                    pageBackgroundType="plain"
                                    footer={false}
                                    layout="blank"
                                >
                                    <EditorSection
                                        control={control}
                                        errors={errors}
                                        setValue={setValue}
                                        readOnly={readOnly && loading}
                                        isEdit={isEdit}
                                        getTemplateById={getTemplateById}
                                        loading={loading}
                                    />
                                </PageContainer>
                            </div>
                        )}

                        {showFrequencyPopup && (
                            <FrequencySection
                                control={control}
                                errors={errors}
                                setValue={setValue}
                                isOpen={showFrequencyPopup}
                                readOnly={readOnly}
                                isEdit={isEdit}
                                onClose={() => setShowFrequencyPopup(false)}
                                onConfirm={handleFrequencyConfirm}
                            />
                        )}
                    </div>
                </Container>

                {!showFrequencyPopup && (
                    <BottomStickyBar>
                        <Container>
                            <div className="flex items-center justify-between px-8">
                                <Button
                                    type="button"
                                    variant="plain"
                                    icon={<TbArrowNarrowLeft />}
                                    onClick={handleBack}
                                >
                                    Back
                                </Button>

                                <div className="flex items-center">
                                    <Button
                                        type="button"
                                        className="ltr:mr-3 rtl:ml-3"
                                        disabled={step === 0}
                                        icon={<TbArrowNarrowLeft />}
                                        onClick={goPrev}
                                    >
                                        Previous
                                    </Button>

                                    {step < 1 ? (
                                        <Button
                                            type="button"
                                            className="ltr:mr-3 rtl:ml-3"
                                            variant="solid"
                                            iconAlignment="end"
                                            icon={<TbArrowNarrowRight />}
                                            loading={isSubmitting}
                                            onClick={goNext}
                                        >
                                            Next
                                        </Button>
                                    ) : (
                                        // !readOnly && (
                                        <Button
                                            type="button"
                                            className="ltr:mr-3 rtl:ml-3"
                                            loading={isSubmitting}
                                            variant="solid"
                                            onClick={() =>
                                                setShowFrequencyPopup(true)
                                            }
                                        >
                                            Submit
                                        </Button>
                                        // )
                                    )}
                                </div>
                            </div>
                        </Container>
                    </BottomStickyBar>
                )}
            </Form>
        </FormProvider>
    )
}
