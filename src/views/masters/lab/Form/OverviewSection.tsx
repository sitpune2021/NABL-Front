import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import { FormItem } from '@/components/ui/Form'
import { Controller } from 'react-hook-form'
import { FormSectionBaseProps } from '@/@types/lab'
import ContactPersonalSection from './ContactPersonalSection'

type OverviewSectionProps = FormSectionBaseProps & {
    existingLabCodes?: string[] // Note: Not used in this component; consider using for custom validation (e.g., uniqueness check) if needed
}

const OverviewSection = ({
    control,
    errors,
    readOnly = false,
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
                        invalid={Boolean(errors.labType)}
                        errorMessage={errors.labType?.message}
                    >
                        <Controller
                            name="labType"
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
                        invalid={Boolean(errors.labCode)}
                        errorMessage={errors.labCode?.message}
                    >
                        <Controller
                            name="labCode"
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
                </div>
                <ContactPersonalSection
                    control={control}
                    errors={errors}
                    readOnly={readOnly}
                />
            </div>
        </Card>
    )
}

export default OverviewSection
