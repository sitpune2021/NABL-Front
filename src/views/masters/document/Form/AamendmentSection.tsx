/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, FormItem, Input } from '@/components/ui'
import { Select } from '@/components/ui/Select'
import { Controller, useFormContext } from 'react-hook-form'

const AamendmentSection = ({ isEdit }: any) => {
    const {
        control,
        formState: { errors },
    } = useFormContext<any>()

    if (!isEdit) return null
    const amendmentOptions = [
        { label: 'Minor (amendment)', value: 'minor' },
        { label: 'Major (issued)', value: 'major' },
    ]

    return (
        <Card className="mb-2 mt-3">
            <h4>Amendment Changes</h4>
            <FormItem
                label="Amendment Type"
                invalid={!!errors.amendment_type}
                errorMessage={errors.amendment_type?.message as string}
            >
                <Controller
                    name="amendment_type"
                    control={control}
                    render={({ field }) => (
                        <Select
                            options={amendmentOptions}
                            value={
                                amendmentOptions.find(
                                    (opt) => opt.value === field.value,
                                ) || null
                            }
                            placeholder="Select Amendment Type"
                            onChange={(option: any) =>
                                field.onChange(option?.value)
                            }
                        />
                    )}
                />
            </FormItem>

            <FormItem
                label="Amendment Reason"
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
