import { useEffect } from 'react'
import { Form } from '@/components/ui/Form'
import Container from '@/components/shared/Container'
import BottomStickyBar from '@/components/template/BottomStickyBar'
import OverviewSection from './OverviewSection'
import isEmpty from 'lodash/isEmpty'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import type { CommonProps } from '@/@types/common'
import { UserFormSchema } from '@/@types/user'
import AddressSection from './AddressSection'
import ProfileImageSection from './ProfileImageSection'
import TagsSection from './TagsSection'

type UserFormProps = {
    onFormSubmit: (values: UserFormSchema) => void
    defaultValues?: UserFormSchema
    newUser?: boolean
    readOnly?: boolean
} & CommonProps

const validationSchema = z.object({
    name: z.string().min(1, { message: ' name required' }),
    username: z.string().min(1, { message: ' username required' }),
    email: z.string().min(1, { message: ' email required' }).email({
        message: 'Invalid email address',
    }),
    role: z
        .array(
            z.object({
                value: z.string().min(1, { message: 'role required' }),
                label: z.string().min(1, { message: 'role required' }),
            }),
        )
        .min(1, { message: 'At least one role is required' }),
    dialCode: z.string().min(1, { message: 'Please select your country code' }),
    phone: z
        .string()
        .min(1, { message: 'Please input your mobile number' })
        .max(10, { message: 'Please your mobile number should be 10 digit' }),
    address: z.string().optional().or(z.literal('')),
    preparedBy: z.boolean(),
    issuedBy: z.boolean(),
    approvedBy: z.boolean(),
    signUpload: z.string().optional().or(z.literal('')),
})

const UserForm = (props: UserFormProps) => {
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
    } = useForm<UserFormSchema>({
        defaultValues: {
            ...defaultValues,
        },
        resolver: zodResolver(validationSchema),
    })

    useEffect(() => {
        if (!isEmpty(defaultValues)) {
            reset(defaultValues)
        }
    }, [JSON.stringify(defaultValues)])

    const onSubmit = (values: UserFormSchema) => {
        onFormSubmit?.(values)
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
                        />
                        <AddressSection
                            control={control}
                            errors={errors}
                            readOnly={readOnly}
                        />
                    </div>
                    <div className="md:w-[370px] gap-4 flex flex-col">
                        <ProfileImageSection
                            control={control}
                            errors={errors}
                            readOnly={readOnly}
                        />
                        <TagsSection
                            control={control}
                            errors={errors}
                            readOnly={readOnly}
                        />
                        {/* {!newCustomer && (
                            <AccountSection control={control} errors={errors} />
                        )} */}
                    </div>
                </div>
            </Container>
            <BottomStickyBar>{children}</BottomStickyBar>
        </Form>
    )
}

export default UserForm
