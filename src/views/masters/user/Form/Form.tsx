import { useEffect, useMemo } from 'react'
import { Form } from '@/components/ui/Form'
import Container from '@/components/shared/Container'
import BottomStickyBar from '@/components/template/BottomStickyBar'
import OverviewSection from './OverviewSection'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm } from 'react-hook-form'
import SignImageSection from './SignImageSection'
import ProfileImageSection from './ProfileImageSection'
import AssignPermissionSection from './AssignPermissionSection'

import { userSchema, UserSchemaType } from '@/schemas/user.schema'
import { CommonProps } from '@/@types/common'
import { EMPTY_VALUES } from '@/constants/user.constants'
import { useSessionUser } from '@/store/authStore'
import AssignLabPermissionSection from './AssignLabPermissionSection'

type UserFormProps = {
    onFormSubmit: (values: UserSchemaType) => void
    defaultValues?: UserSchemaType
    readOnly?: boolean
    loading?: boolean
} & CommonProps

const UserForm = ({
    onFormSubmit,
    defaultValues,
    readOnly = false,
    loading = false,
    children,
}: UserFormProps) => {
    const activeLab = useSessionUser((state) => state.activeLab)

    const memoizedDefaults = useMemo(
        () => defaultValues ?? EMPTY_VALUES,
        [defaultValues],
    )

    const methods = useForm<UserSchemaType>({
        resolver: zodResolver(userSchema),
        defaultValues: memoizedDefaults,
        mode: 'onSubmit',
        reValidateMode: 'onChange',
    })

    const { handleSubmit, reset } = methods

    useEffect(() => {
        if (defaultValues) {
            reset(defaultValues)
        }
    }, [defaultValues, reset])

    return (
        <FormProvider {...methods}>
            <Form
                className="flex w-full h-full"
                containerClassName="flex flex-col w-full justify-between"
                onSubmit={handleSubmit(onFormSubmit)}
            >
                <Container>
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex flex-col gap-4 flex-auto">
                            <OverviewSection
                                readOnly={readOnly}
                                loading={loading}
                            />
                            {activeLab?.lab_id == 0 && (
                                <AssignPermissionSection
                                    readOnly={readOnly}
                                    loading={loading}
                                />
                            )}
                        </div>

                        <div className="md:w-[370px] flex flex-col gap-4">
                            <ProfileImageSection
                                readOnly={readOnly}
                                loading={loading}
                            />
                            <SignImageSection
                                readOnly={readOnly}
                                loading={loading}
                            />
                        </div>
                    </div>
                    {activeLab?.lab_id != 0 && (
                        <div className="mt-4">
                            <AssignLabPermissionSection
                                readOnly={readOnly}
                                loading={loading}
                            />
                        </div>
                    )}
                </Container>

                <BottomStickyBar>{children}</BottomStickyBar>
            </Form>
        </FormProvider>
    )
}

export default UserForm
