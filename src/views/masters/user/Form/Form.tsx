/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react'
import { Form } from '@/components/ui/Form'
import Container from '@/components/shared/Container'
import BottomStickyBar from '@/components/template/BottomStickyBar'
import OverviewSection from './OverviewSection'
import isEmpty from 'lodash/isEmpty'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm } from 'react-hook-form'
import { UserFormSchema } from '@/@types/user'
import AddressSection from './AddressSection'
import SignImageSection from './SignImageSection'
import ProfileImageSection from './ProfileImageSection'
import AssignPermissionSection from './AssignPermissionSection'
import LabAssignmentSection from './LabAssignmentSection'

import { userSchema } from '@/schemas/user.schema'

interface UserFormProps {
    step?: number
    defaultValues?: UserFormSchema
    readOnly?: boolean
    onFormSubmit: (values: UserFormSchema) => void
    onMethodsReady?: (methods: any) => void
    children?: React.ReactNode
}

const UserForm = ({
    step = 0,
    defaultValues,
    readOnly = false,
    onFormSubmit,
    onMethodsReady,
    children,
}: UserFormProps) => {
    const methods = useForm<UserFormSchema>({
        defaultValues,
        resolver: zodResolver(userSchema),
        shouldUnregister: false,
    })

    const {
        handleSubmit,
        reset,
        control,
        setValue,
        formState: { errors },
    } = methods

    useEffect(() => {
        onMethodsReady?.(methods)
    }, [methods])

    useEffect(() => {
        if (!isEmpty(defaultValues)) {
            reset(defaultValues)
        }
    }, [defaultValues])

    return (
        <FormProvider {...methods}>
            <Form
                className="flex w-full h-full"
                containerClassName="flex flex-col w-full justify-between"
                onSubmit={handleSubmit(onFormSubmit)}
            >
                <Container>
                    {step === 0 && (
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex flex-col gap-4 flex-auto">
                                <OverviewSection
                                    control={control}
                                    errors={errors}
                                    readOnly={readOnly}
                                />
                                <AssignPermissionSection
                                    control={control}
                                    errors={errors}
                                    readOnly={readOnly}
                                    setValue={setValue}
                                />
                            </div>

                            <div className="md:w-[370px] flex flex-col gap-4">
                                <ProfileImageSection
                                    control={control}
                                    errors={errors}
                                    readOnly={readOnly}
                                />
                                <SignImageSection
                                    control={control}
                                    errors={errors}
                                    readOnly={readOnly}
                                />
                                <AddressSection
                                    control={control}
                                    errors={errors}
                                    readOnly={readOnly}
                                />
                            </div>
                        </div>
                    )}

                    {step === 1 && (
                        <LabAssignmentSection
                            control={control}
                            errors={errors}
                            setValue={setValue}
                            readOnly={readOnly}
                        />
                    )}
                </Container>

                <BottomStickyBar>{children}</BottomStickyBar>
            </Form>
        </FormProvider>
    )
}

export default UserForm
