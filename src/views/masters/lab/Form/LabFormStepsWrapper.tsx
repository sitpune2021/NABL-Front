/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import Steps from '@/components/ui/Steps'
import Button from '@/components/ui/Button'
import LabForm from './Form'

interface LabFormStepsWrapperProps {
    labFormProps: any
}

const STEP_TITLES = ['Overview', 'Locations', 'Clauses & Documents']

const LabFormStepsWrapper = ({ labFormProps }: LabFormStepsWrapperProps) => {
    const [step, setStep] = useState(0)
    const [formMethods, setFormMethods] = useState<any>(null)

    const onNext = async (e?: React.MouseEvent) => {
        e?.preventDefault()

        if (!formMethods?.trigger) return

        if (step === 0) {
            const valid = await formMethods.trigger([
                'name',
                'labType',
                'labCode',
                'emails',
                'phones',
            ])
            if (!valid) return
            setStep(1)
            return
        }

        if (step === 1) {
            const valid = await formMethods.trigger(['location'])
            if (!valid) return
            setStep(2)
        }
    }

    const onPrevious = () => {
        if (step > 0) setStep(step - 1)
    }

    return (
        <div className="flex flex-col h-full">
            <Steps current={step}>
                {STEP_TITLES.map((title) => (
                    <Steps.Item key={title} title={title} />
                ))}
            </Steps>

            <div className="flex-1 mt-6">
                <LabForm
                    {...labFormProps}
                    step={step}
                    onMethodsReady={setFormMethods}
                >
                    <div className="flex justify-end gap-2 mt-6">
                        <Button
                            type="button"
                            disabled={step === 0}
                            onClick={onPrevious}
                        >
                            Previous
                        </Button>

                        {step < STEP_TITLES.length - 1 ? (
                            <Button
                                type="button"
                                variant="solid"
                                onClick={(e) => onNext(e)}
                            >
                                Next
                            </Button>
                        ) : (
                            <Button
                                type="submit"
                                variant="solid"
                                disabled={labFormProps?.isSubmitting}
                            >
                                Submit
                            </Button>
                        )}
                    </div>
                </LabForm>
            </div>
        </div>
    )
}

export default LabFormStepsWrapper
