/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import Steps from '@/components/ui/Steps'
import Button from '@/components/ui/Button'
import UserForm from './Form'

const STEP_TITLES = ['User Info', 'Lab Assignments']

interface UserFormStepsWrapperProps {
    userFormProps: any
}

const UserFormStepsWrapper = ({ userFormProps }: UserFormStepsWrapperProps) => {
    const [step, setStep] = useState(0)
    const [formMethods, setFormMethods] = useState<any>(null)

    const onNext = async () => {
        if (!formMethods?.trigger) {
            setStep(step + 1)
            return
        }

        if (step === 0) {
            const valid = await formMethods.trigger([
                'name',
                'username',
                'email',
                'phone',
                'role',
            ])
            if (!valid) return
        }

        setStep(step + 1)
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
                <UserForm
                    {...userFormProps}
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
                                onClick={onNext}
                            >
                                Next
                            </Button>
                        ) : (
                            <Button
                                type="submit"
                                variant="solid"
                                loading={userFormProps?.isSubmitting}
                            >
                                Save User
                            </Button>
                        )}
                    </div>
                </UserForm>
            </div>
        </div>
    )
}

export default UserFormStepsWrapper
