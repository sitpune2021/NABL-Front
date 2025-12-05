import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import { FormItem } from '@/components/ui/Form'
import { Controller } from 'react-hook-form'
import { FormSectionBaseProps } from '@/@types/unit'

type OverviewSectionProps = FormSectionBaseProps & {
    hasDuplicate?: boolean
}

const OverviewSection = ({
    control,
    errors,
    readOnly,
    hasDuplicate = false,
}: OverviewSectionProps) => {
    return (
        <Card>
            <h4 className="mb-6">Unit</h4>
            <div className="grid md:grid-cols-2 gap-4">
                <FormItem
                    label="Name"
                    invalid={Boolean(errors.name) || hasDuplicate}
                    errorMessage={
                        hasDuplicate
                            ? 'This unit name already exists with different case'
                            : errors.name?.message
                    }
                >
                    <Controller
                        name="name"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                autoComplete="off"
                                readOnly={readOnly}
                                placeholder="Unit Name"
                                {...field}
                                className={hasDuplicate ? 'border-warning' : ''}
                            />
                        )}
                    />
                </FormItem>
            </div>
        </Card>
    )
}

export default OverviewSection
