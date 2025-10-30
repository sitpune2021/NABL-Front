import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import { FormItem } from '@/components/ui/Form'
import { Controller } from 'react-hook-form'
import { FormSectionBaseProps } from '@/@types/lab'

type OverviewSectionProps = FormSectionBaseProps & {
    existingLabCodes?: string[]
}

const OverviewSection = ({
    control,
    errors,
    readOnly = false,
}: OverviewSectionProps) => {
    return (
        <Card>
            <h4 className="mb-6">Overview</h4>

            {/* LAB DETAILS */}
            <div className="grid md:grid-cols-2 gap-4">
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
                                placeholder="Lab Name"
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
                                placeholder="Lab Type"
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
                                readOnly
                                placeholder="Auto-generated"
                            />
                        )}
                    />
                </FormItem>
            </div>
        </Card>
    )
}

export default OverviewSection
