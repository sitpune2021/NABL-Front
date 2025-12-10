import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import { FormItem } from '@/components/ui/Form'
import { Controller } from 'react-hook-form'
import { FormSectionBaseProps } from '@/@types/signatoryOn'

type OverviewSectionProps = FormSectionBaseProps

const OverviewSection = ({
    control,
    errors,
    readOnly,
}: OverviewSectionProps) => {
    return (
        <Card>
            <h4 className="mb-6">SignatoryOn</h4>
            <div className="grid md:grid-cols-2 gap-4">
                <FormItem
                    label="Name"
                    invalid={Boolean(errors.name)}
                    errorMessage={errors.name?.message}
                >
                    <Controller
                        name="name"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                autoComplete="off"
                                readOnly={readOnly}
                                placeholder="First Name"
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
