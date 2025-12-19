import { memo } from 'react'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import { FormItem } from '@/components/ui/Form'
import { useFormContext } from 'react-hook-form'
import { CategoryFormSchema } from '@/schemas/category.schema'

type OverviewSectionProps = {
    readOnly?: boolean
    loading?: boolean
}
const OverviewSection = ({ readOnly, loading }: OverviewSectionProps) => {
    const {
        register,
        formState: { errors },
    } = useFormContext<CategoryFormSchema>()

    return (
        <Card>
            <h4 className="mb-6">Category</h4>
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
