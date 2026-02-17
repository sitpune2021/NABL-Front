/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, FormItem, Input } from '@/components/ui'
import { Controller, useFormContext } from 'react-hook-form'

const AamendmentSection = ({ isEdit }: any) => {
    const {
        control,
        formState: { errors },
    } = useFormContext<any>()

    if (!isEdit) return ''

    return (
        <Card className="mb-2">
            <h4>Amendment Changes</h4>
            <FormItem
                label="amendment Type"
                invalid={!!errors.amendment_type}
                errorMessage={errors.amendment_type?.message as string}
            >
                <Controller
                    name="amendment_type"
                    control={control}
                    render={({ field }) => (
                        <select
                            {...field}
                            className="border rounded-md px-3 py-2 w-full"
                        >
                            <option value="">Select</option>
                            <option value="minor">Minor (amendment)</option>
                            <option value="major">Major (issued)</option>
                        </select>
                    )}
                />
            </FormItem>

            <FormItem
                label="amendment_reason"
                invalid={!!errors.amendment_reason}
                errorMessage={errors.amendment_reason?.message as string}
            >
                <Controller
                    name="amendment_reason"
                    control={control}
                    render={({ field }) => (
                        <Input placeholder="Enter Message" {...field} />
                    )}
                />
            </FormItem>
        </Card>
    )
}

export default AamendmentSection
