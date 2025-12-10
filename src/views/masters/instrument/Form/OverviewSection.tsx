import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import { FormItem } from '@/components/ui/Form'
import { Controller } from 'react-hook-form'
import { FormSectionBaseProps } from '@/@types/instrument'

type OverviewSectionProps = FormSectionBaseProps

const OverviewSection = ({
    control,
    errors,
    readOnly,
}: OverviewSectionProps) => {
    return (
        <Card>
            <h4 className="mb-6">Instrument</h4>

            <div className="grid md:grid-cols-2 gap-4">
                <FormItem
                    label="Full Name"
                    invalid={Boolean(errors.full_name)}
                    errorMessage={errors.full_name?.message}
                >
                    <Controller
                        name="full_name"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                autoComplete="off"
                                readOnly={readOnly}
                                placeholder="Enter Full Name"
                                {...field}
                            />
                        )}
                    />
                </FormItem>

                <FormItem
                    label="Short Name"
                    invalid={Boolean(errors.short_name)}
                    errorMessage={errors.short_name?.message}
                >
                    <Controller
                        name="short_name"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                autoComplete="off"
                                readOnly={readOnly}
                                placeholder="Enter Short Name"
                                {...field}
                            />
                        )}
                    />
                </FormItem>

                <FormItem
                    label="Make (Manufacturer)"
                    invalid={Boolean(errors.manufacture)}
                    errorMessage={errors.manufacture?.message}
                >
                    <Controller
                        name="manufacture"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                autoComplete="off"
                                readOnly={readOnly}
                                placeholder="Enter Manufacturer Name"
                                {...field}
                            />
                        )}
                    />
                </FormItem>

                <FormItem
                    label="Serial Number"
                    invalid={Boolean(errors.serial_number)}
                    errorMessage={errors.serial_number?.message}
                >
                    <Controller
                        name="serial_number"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                autoComplete="off"
                                readOnly={readOnly}
                                placeholder="Enter Serial Number"
                                {...field}
                            />
                        )}
                    />
                </FormItem>

                <FormItem
                    label="Prefix"
                    invalid={Boolean(errors.prefix)}
                    errorMessage={errors.prefix?.message}
                >
                    <Controller
                        name="prefix"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                autoComplete="off"
                                readOnly={readOnly}
                                placeholder="Enter Prefix"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
            </div>
        </Card>
    )
}

export default OverviewSection
