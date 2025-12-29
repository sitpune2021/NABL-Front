import { memo } from 'react'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import { FormItem } from '@/components/ui/Form'
import { useFormContext } from 'react-hook-form'
import { InstrumentFormSchema } from '@/schemas/instrument.schema'

type OverviewSectionProps = {
    readOnly?: boolean
    loading?: boolean
}
const OverviewSection = ({ readOnly, loading }: OverviewSectionProps) => {
    const {
        register,
        formState: { errors },
    } = useFormContext<InstrumentFormSchema>()

    return (
        <Card>
            <h4 className="mb-6">Instrument</h4>

            <div className="grid md:grid-cols-2 gap-4">
                <FormItem
                    label="Full Name"
                    invalid={!!errors.name}
                    errorMessage={errors.name?.message}
                >
                    <Input
                        type="text"
                        autoComplete="off"
                        placeholder="Enter Name"
                        disabled={readOnly || loading}
                        {...register('name')}
                    />
                </FormItem>

                <FormItem
                    label="Short Name"
                    invalid={!!errors.short_name}
                    errorMessage={errors.short_name?.message}
                >
                    <Input
                        type="text"
                        autoComplete="off"
                        placeholder="Enter Short Name"
                        disabled={readOnly || loading}
                        {...register('short_name')}
                    />
                </FormItem>

                <FormItem
                    label="Make (Manufacturer)"
                    invalid={!!errors.manufacturer}
                    errorMessage={errors.manufacturer?.message}
                >
                    <Input
                        type="text"
                        autoComplete="off"
                        placeholder="Enter Manufacturer Name"
                        disabled={readOnly || loading}
                        {...register('manufacturer')}
                    />
                </FormItem>

                <FormItem
                    label="Serial Number"
                    invalid={!!errors.serial_no}
                    errorMessage={errors.serial_no?.message}
                >
                    <Input
                        type="text"
                        autoComplete="off"
                        placeholder="Enter Serial Number"
                        disabled={readOnly || loading}
                        {...register('serial_no')}
                    />
                </FormItem>

                <FormItem
                    label="Prefix"
                    invalid={!!errors.identifier}
                    errorMessage={errors.identifier?.message}
                >
                    <Input
                        type="text"
                        autoComplete="off"
                        placeholder="Enter Prefix"
                        disabled={readOnly || loading}
                        {...register('identifier')}
                    />
                </FormItem>
            </div>
        </Card>
    )
}

export default memo(OverviewSection)
