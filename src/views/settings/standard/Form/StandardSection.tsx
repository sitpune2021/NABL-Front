/* eslint-disable @typescript-eslint/no-explicit-any */
import Card from '@/components/ui/Card'
import { FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import { StandardFormSchema } from '@/schemas/standard.schema'

import { useFormContext } from 'react-hook-form'

const StandardSection = ({ readOnly, loading }: any) => {
    const {
        register,
        formState: { errors },
    } = useFormContext<StandardFormSchema>()

    return (
        <Card>
            <h4 className="mb-6 text-lg font-semibold">Standard</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
                <FormItem
                    label="Name"
                    invalid={!!errors.name}
                    errorMessage={errors.name?.message}
                >
                    <Input
                        type="text"
                        placeholder="Enter Name"
                        disabled={readOnly || loading}
                        {...register('name')}
                    />
                </FormItem>
                <FormItem
                    label="Unique Id"
                    invalid={Boolean(errors.uuid)}
                    errorMessage={errors.uuid?.message}
                >
                    <Input
                        type="text"
                        placeholder="Enter Unique Id"
                        disabled={readOnly || loading}
                        {...register('uuid')}
                    />
                </FormItem>
            </div>
        </Card>
    )
}

export default StandardSection
