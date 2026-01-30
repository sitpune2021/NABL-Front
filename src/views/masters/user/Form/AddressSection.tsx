import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import { FormItem } from '@/components/ui/Form'
import { Controller, useFormContext } from 'react-hook-form'
import { FormSectionBaseProps } from '@/@types/user'
import { UserSchemaType } from '@/schemas/user.schema'

type AddressSectionProps = FormSectionBaseProps

const AddressSection = ({ readOnly, loading }: AddressSectionProps) => {
    const {
        control,
        formState: { errors },
    } = useFormContext<UserSchemaType>()
    return (
        <Card>
            <h4 className="mb-6">Address Information</h4>
            <FormItem
                label="Address"
                invalid={!!errors.address}
                errorMessage={errors.address?.message}
            >
                <Controller
                    name="address"
                    control={control}
                    render={({ field }) => (
                        <Input
                            {...field}
                            autoComplete="off"
                            placeholder="Enter full address"
                            readOnly={readOnly || loading}
                            rows={2}
                            textArea={true}
                        />
                    )}
                />
            </FormItem>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormItem
                    label="City"
                    invalid={!!errors.city}
                    errorMessage={errors.city?.message}
                >
                    <Controller
                        name="city"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                autoComplete="off"
                                placeholder="City"
                                {...field}
                                readOnly={readOnly || loading}
                            />
                        )}
                    />
                </FormItem>
                <FormItem
                    label="Postal Code"
                    invalid={!!errors.postcode}
                    errorMessage={errors.postcode?.message}
                >
                    <Controller
                        name="postcode"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                autoComplete="off"
                                placeholder="Postal Code"
                                {...field}
                                readOnly={readOnly || loading}
                            />
                        )}
                    />
                </FormItem>
            </div>
        </Card>
    )
}

export default AddressSection
