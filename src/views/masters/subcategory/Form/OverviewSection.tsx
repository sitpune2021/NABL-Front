import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import { FormItem } from '@/components/ui/Form'
import { Controller, useWatch } from 'react-hook-form'
import { FormSectionBaseProps } from '@/@types/subcategory'
import { Select } from '@/components/ui'
import useCategoryList from '../../category/List/hooks/useList'

type OverviewSectionProps = FormSectionBaseProps

const OverviewSection = ({
    control,
    errors,
    readOnly,
}: OverviewSectionProps) => {
    const { categoryList } = useCategoryList()
    const options = categoryList.map((category) => ({
        value: category.id,
        label: category.name.toUpperCase(),
        identifier: category.identifier, // make sure your API includes this
    }))

    const selecteCatIdentifier = useWatch({ control, name: 'cat_id' })
    const selectedCatIdentifier = options.find(
        (z) => z.value === selecteCatIdentifier,
    )

    return (
        <Card>
            <h4 className="mb-6">Sub Category</h4>
            <div className="grid md:grid-cols-2 gap-4">
                <FormItem
                    label="Category Name"
                    invalid={Boolean(errors.cat_id)}
                    errorMessage={errors.cat_id?.message}
                >
                    <Controller
                        name="cat_id"
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
                    label="Sub Category"
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
                                placeholder="Sub Category"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
                <FormItem
                    label="Prefix"
                    invalid={Boolean(errors.identifier)}
                    errorMessage={errors.identifier?.message}
                >
                    <Controller
                        name="identifier"
                        control={control}
                        render={({ field: { onChange, value, ...rest } }) => (
                            <Input
                                type="text"
                                autoComplete="off"
                                readOnly={readOnly}
                                placeholder="Prefix"
                                value={
                                    selectedCatIdentifier?.identifier
                                        ? `${selectedCatIdentifier.identifier}-${(value || '').replace(`${selectedCatIdentifier.identifier}-`, '')}`
                                        : value || ''
                                }
                                onChange={(e) => {
                                    const inputValue = e.target.value
                                    const cleanedValue =
                                        selectedCatIdentifier?.identifier
                                            ? inputValue.replace(
                                                  `${selectedCatIdentifier.identifier}-`,
                                                  '',
                                              )
                                            : inputValue
                                    onChange(
                                        selectedCatIdentifier?.identifier
                                            ? `${selectedCatIdentifier.identifier}-${cleanedValue}`
                                            : cleanedValue,
                                    )
                                }}
                                {...rest}
                            />
                        )}
                    />
                </FormItem>
            </div>
        </Card>
    )
}

export default OverviewSection
