/* eslint-disable @typescript-eslint/no-explicit-any */
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import { FormItem } from '@/components/ui/Form'
import { Controller } from 'react-hook-form'
import { FormSectionBaseProps } from '@/@types/lab'
import ContactPersonalSection from './ContactPersonalSection'

type OverviewSectionProps = FormSectionBaseProps & {
    setValue?: any
    existingLabCodes?: string[] // Note: Not used in this component; consider using for custom validation (e.g., uniqueness check) if needed
}

const OverviewSection = ({
    control,
    errors,
    readOnly = false,
    setValue,
}: OverviewSectionProps) => {
    return (
        <Card>
            <div className="flex flex-col space-y-4 w-full">
                <h3
                    className="text-lg font-semibold mb-4"
                    id="overview-section"
                >
                    Overview
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                    <FormItem
                        label="Lab Name"
                        invalid={Boolean(errors.name)}
                        errorMessage={errors.name?.message}
                    >
                        <Controller
                            name="name"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    placeholder="Enter Lab Name"
                                    readOnly={readOnly}
                                />
                            )}
                        />
                    </FormItem>

                    <FormItem
                        label="Lab Type"
                        invalid={Boolean(errors.lab_type)}
                        errorMessage={errors.lab_type?.message}
                    >
                        <Controller
                            name="lab_type"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    placeholder="Enter Lab Type"
                                    readOnly={readOnly}
                                />
                            )}
                        />
                    </FormItem>

                    <FormItem
                        label="Lab Code"
                        invalid={Boolean(errors.lab_code)}
                        errorMessage={errors.lab_code?.message}
                    >
                        <Controller
                            name="lab_code"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    readOnly={true} // Always readOnly as it's auto-generated; respects overall readOnly prop if needed
                                    placeholder="Auto-generated"
                                />
                            )}
                        />
                    </FormItem>
                    <FormItem
                        label="Lab Location Limit"
                        invalid={Boolean(errors.location_limit)}
                        errorMessage={errors.location_limit?.message}
                    >
                        <Controller
                            name="location_limit"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    readOnly={readOnly}
                                    placeholder="Lab Location Limit"
                                />
                            )}
                        />
                    </FormItem>
                    <FormItem
                        label="Lab User Limit"
                        invalid={Boolean(errors.user_limit)}
                        errorMessage={errors.user_limit?.message}
                    >
                        <Controller
                            name="user_limit"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    readOnly={readOnly}
                                    placeholder="Lab User Limit"
                                />
                            )}
                        />
                    </FormItem>
                </div>
                <ContactPersonalSection
                    control={control}
                    errors={errors}
                    readOnly={readOnly}
                    setValue={setValue}
                />
            </div>
        </Card>
    )
}

export default OverviewSection
