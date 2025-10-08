import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import { FormItem } from '@/components/ui/Form'
import { Controller } from 'react-hook-form'
import { FormSectionBaseProps } from '@/@types/subcategory'
import { Checkbox, Select } from '@/components/ui'
import useCategoryList from '../../category/List/hooks/useList'

type OverviewSectionProps = FormSectionBaseProps

const OverviewSection = ({
    control,
    errors,
    readOnly,
}: OverviewSectionProps) => {
    const { categoryList } = useCategoryList()
    const options = categoryList.map((category) => ({
        value: category.name,
        label: category.name.toUpperCase(),
    }))

    return (
        <Card>
            <h4 className="mb-6">Overview</h4>
            <div className="grid md:grid-cols-2 gap-4">
                <FormItem
                    label="Category Name"
                    invalid={Boolean(errors.name)}
                    errorMessage={errors.name?.message}
                >
                    <Controller
                        name="name"
                        control={control}
                        render={({ field }) => (
                            <Select
                                {...field}
                                value={options.filter(
                                    (option) => option.value === field.value,
                                )}
                                options={options}
                                placeholder="Select Category"
                                onChange={(option) =>
                                    field.onChange(option?.value)
                                }
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
                                placeholder="Prefix"
                                {...field}
                            />
                        )}
                    />
                </FormItem>

                <FormItem
                    label="Sub Category"
                    invalid={Boolean(errors.subcategory)}
                    errorMessage={errors.subcategory?.message}
                >
                    <Controller
                        name="subcategory"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                autoComplete="off"
                                readOnly={readOnly}
                                placeholder="Sub Category"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
                <FormItem
                    label="Required"
                    invalid={Boolean(errors.required)}
                    errorMessage={errors.required?.message}
                >
                    <Controller
                        name="required"
                        control={control}
                        render={({ field }) => (
                            <Checkbox
                                key={field.ref.name}
                                defaultChecked={field.value}
                                {...field}
                            />
                        )}
                    />
                </FormItem>

                <FormItem
                    label="Initial Timezone"
                    invalid={Boolean(errors.initialtimezone)}
                    errorMessage={errors.initialtimezone?.message}
                >
                    <Controller
                        name="initialtimezone"
                        control={control}
                        render={({ field }) => (
                            <Checkbox
                                key={field.ref.name}
                                defaultChecked={field.value}
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
