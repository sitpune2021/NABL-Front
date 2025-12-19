import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import { FormItem } from '@/components/ui/Form'
import { useFormContext } from 'react-hook-form'
import { UnitFormSchema } from '@/schemas/unit.schema'

type OverviewSectionProps = {
    readOnly?: boolean
    loading?: boolean
}
const OverviewSection = ({ readOnly, loading }: OverviewSectionProps) => {
    const {
        register,
        formState: { errors },
    } = useFormContext<UnitFormSchema>()
    return (
        <Card>
            <h4 className="mb-6">Unit</h4>
            <div className="grid md:grid-cols-2 gap-4">
                <FormItem
                    label="Name"
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
            </div>
        </Card>
    )
}

export default OverviewSection
