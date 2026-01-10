/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react'
import { Form } from '@/components/ui/Form'
import Container from '@/components/shared/Container'
import BottomStickyBar from '@/components/template/BottomStickyBar'
import Button from '@/components/ui/Button'
import OverviewSection from './OverviewSection'
import isEmpty from 'lodash/isEmpty'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import type { CommonProps } from '@/@types/common'
import { UserFormSchema } from '@/@types/user'
import AddressSection from './AddressSection'
import SignImageSection from './SignImageSection'
import ProfileImageSection from './ProfileImageSection'
import AssignPermissionSection from './AssignPermissionSection'
import LabAssignmentSection from './LabAssignmentSection'

type UserFormProps = {
    onFormSubmit: (values: UserFormSchema) => void
    onDiscard: () => void
    defaultValues?: UserFormSchema
    newUser?: boolean
    readOnly?: boolean
    isSubmitting?: boolean
    isEdit?: boolean
    currentStep?: number
    onStepChange?: (step: number) => void
} & CommonProps

const userInfoValidation = z.object({
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
    signature: z.string().optional(),
    profileImage: z.string().optional(),
    userRoles: z
        .array(
            z.object({
                zone_id: z.union([z.number(), z.string()]).optional(),
                cluster_id: z.union([z.number(), z.string()]).optional(),
                location_id: z.union([z.number(), z.string()]).optional(),
                department: z
                    .array(
                        z.object({
                            department_id: z
                                .union([z.number(), z.string()])
                                .optional(),
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
                                    z.union([z.string(), z.number()]),
                                    z.record(z.string(), z.array(z.string())),
                                )
                                .optional(),
                        }),
                    )
                    .optional(),
            }),
        )
        .optional(),
})

const labAssignmentsValidation = z.object({
    labAssignments: z
        .record(
            z.string(),
            z.record(
                z.string(),
                z.object({
                    locationId: z.string(),
                    roleId: z.string().optional(),
                }),
            ),
        )
        .optional(),
})

const validationSchema = userInfoValidation.merge(labAssignmentsValidation)

const UserForm = (props: UserFormProps) => {
    const {
        onFormSubmit,
        onDiscard,
        defaultValues = {},
        readOnly = false,
        isSubmitting = false,
        currentStep = 0,
        onStepChange,
    } = props

    const {
        handleSubmit,
        reset,
        formState: { errors },
        control,
        setValue,
        trigger,
    } = useForm<UserFormSchema>({
        defaultValues: {
            ...defaultValues,
        },
        resolver: zodResolver(validationSchema),
        mode: 'onBlur',
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
                labAssignments: defaultValues.labAssignments || {},
            }
            reset(formattedValues)
        }
    }, [defaultValues, reset])

    const onSubmit = async (values: UserFormSchema) => {
        console.log(' Form onSubmit called, Step:', currentStep)
        console.log(' Form Values:', values)

        if (currentStep === 0) {
            const isValid = await trigger([
                'name',
                'username',
                'email',
                'dialCode',
                'phone',
            ])
            console.log(' Step 0 Validation:', isValid)
            if (!isValid) {
                return
            }
        }
        onFormSubmit?.(values)
    }

    const handlePrevious = () => {
        if (onStepChange) onStepChange(0)
    }

    return (
        <Form
            className="flex w-full h-full"
            containerClassName="flex flex-col w-full justify-between"
            onSubmit={handleSubmit(onSubmit)}
        >
            <Container>
                <div className="mb-4 p-4 bg-blue-50 rounded">
                    <h2 className="text-lg font-bold text-blue-900">
                        {currentStep === 0
                            ? ' Step 1: User Information'
                            : ' Step 2: Lab Assignments'}
                    </h2>
                </div>

                {currentStep === 0 && (
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

                {currentStep === 1 && (
                    <div className="mt-6">
                        <LabAssignmentSection
                            control={control}
                            errors={errors}
                            setValue={setValue}
                            readOnly={readOnly}
                        />
                    </div>
                )}
            </Container>

            {!readOnly && (
                <BottomStickyBar>
                    <div className="flex items-center justify-between w-full">
                        <div className="flex gap-2">
                            {currentStep === 1 && (
                                <Button
                                    type="button"
                                    variant="solid"
                                    disabled={isSubmitting}
                                    onClick={handlePrevious}
                                >
                                    Previous
                                </Button>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant="plain"
                                disabled={isSubmitting}
                                onClick={onDiscard}
                            >
                                Cancel
                            </Button>
                            {currentStep === 0 && (
                                <Button
                                    type="submit"
                                    variant="solid"
                                    loading={isSubmitting}
                                    disabled={isSubmitting}
                                >
                                    Save & Next
                                </Button>
                            )}
                            {currentStep === 1 && (
                                <Button
                                    type="submit"
                                    variant="solid"
                                    loading={isSubmitting}
                                    disabled={isSubmitting}
                                >
                                    Save & Finish
                                </Button>
                            )}
                        </div>
                    </div>
                </BottomStickyBar>
            )}
        </Form>
    )
}

export default UserForm
