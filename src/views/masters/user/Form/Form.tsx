/* eslint-disable @typescript-eslint/no-explicit-any */
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
import AssignPermissionSection from './AssignPermissionSection'

type UserFormProps = {
    onFormSubmit: (values: UserFormSchema) => void
    defaultValues?: UserFormSchema
    newUser?: boolean
    readOnly?: boolean
} & CommonProps

const validationSchema = z.object({
    name: z.string().min(1, { message: 'Name required' }),
    username: z.string().min(1, { message: 'Username required' }),
    email: z
        .string()
        .min(1, { message: 'Email required' })
        .email({ message: 'Invalid email address' }),

    dialCode: z.string().min(1, { message: 'Please select your country code' }),
    phone: z
        .string()
        .min(1, { message: 'Please input your mobile number' })
        .max(10, { message: 'Mobile number must be 10 digits' }),

    address: z.string().optional(),
    city: z.string().optional(),
    postcode: z.string().optional(),

    preparedBy: z.boolean(),
    issuedBy: z.boolean(),
    approvedBy: z.boolean(),

    signature: z.string().optional(),

    userRoles: z
        .array(
            z.object({
                zone_id: z.number().optional(),
                cluster_id: z.number().optional(),
                location_id: z.number().optional(),

                department: z
                    .array(
                        z.object({
                            department_id: z.number().optional(),
                            roles: z
                                .array(
                                    z.object({
                                        value: z.number().optional(),
                                        label: z.string().optional(),
                                    }),
                                )
                                .optional(),
                            permissions: z
                                .record(
                                    z.union([
                                        z.string(), // role name
                                        z.number(),
                                    ]),
                                    z.record(
                                        z.string(), // module id
                                        z.array(z.string()), // permission types
                                    ),
                                )
                                .optional(),
                        }),
                    )
                    .optional(),
            }),
        )
        .optional(),
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
        setValue,
    } = useForm<UserFormSchema>({
        defaultValues: {
            ...defaultValues,
        },
        resolver: zodResolver(validationSchema),
    })

    useEffect(() => {
        if (!isEmpty(defaultValues)) {
            const existingUserRoles = (defaultValues as any).userRoles
            const formattedValues = {
                ...defaultValues,
                userRoles: existingUserRoles || [
                    {
                        zone_id: '',
                        cluster_id: '',
                        location_name: '',
                        department: [
                            {
                                department_name: '',
                                roles: [],
                                permissions: {},
                            },
                        ],
                    },
                ],
            }
            reset(formattedValues)
        }
    }, [defaultValues, reset])

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
                        <AssignPermissionSection
                            control={control}
                            errors={errors}
                            readOnly={readOnly}
                            setValue={setValue}
                        />
                    </div>
                    <div className="md:w-[370px] gap-4 flex flex-col">
                        <ProfileImageSection
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
            </Container>
            <BottomStickyBar>{children}</BottomStickyBar>
        </Form>
    )
}

export default UserForm
