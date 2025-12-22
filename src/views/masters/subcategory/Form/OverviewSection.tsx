import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import { FormItem } from '@/components/ui/Form'
import { Controller, useFormContext } from 'react-hook-form'
import { Select } from '@/components/ui'
import { useCategoryList } from '../../category/List/hooks/useList'
import { SubCategoryFormSchema } from '@/schemas/sub_category.schema'
import { useMemo } from 'react'

type OverviewSectionProps = {
    readOnly?: boolean
    loading?: boolean
}

const OverviewSection = ({ readOnly, loading }: OverviewSectionProps) => {
    const {
        register,
        control,
        setValue,
        getValues,
        formState: { errors },
    } = useFormContext<SubCategoryFormSchema>()

    const { categoryList } = useCategoryList()

    const options = useMemo(
        () =>
            categoryList.map((category) => ({
                value: category.id,
                label: category.name.toUpperCase(),
                identifier: category.identifier,
            })),
        [categoryList],
    )

    return (
        <Card>
            <h4 className="mb-6">Sub Category</h4>
            <div className="grid md:grid-cols-2 gap-4">
                <FormItem
                    label="Category Name"
                    invalid={!!errors.cat_id}
                    errorMessage={errors.cat_id?.message}
                >
                    <Controller
                        name="cat_id"
                        control={control}
                        render={({ field }) => (
                            <Select
                                options={options}
                                placeholder="Select Category"
                                value={options.find(
                                    (opt) => opt.value === field.value,
                                )}
                                isDisabled={readOnly || loading}
                                onChange={(option) => {
                                    field.onChange(option?.value)

                                    if (!option) return

                                    const currentIdentifier =
                                        getValues('identifier') || ''
                                    const suffix = currentIdentifier
                                        .split('-')
                                        .slice(1)
                                        .join('-')

                                    setValue(
                                        'identifier',
                                        suffix
                                            ? `${option.identifier}-${suffix}`
                                            : `${option.identifier}-`,
                                        {
                                            shouldDirty: true,
                                            shouldValidate: true,
                                        },
                                    )
                                }}
                            />
                        )}
                    />
                </FormItem>

                <FormItem
                    label="Sub Category"
                    invalid={!!errors.name}
                    errorMessage={errors.name?.message}
                >
                    <Input
                        type="text"
                        placeholder="Sub Category"
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
                        placeholder="Prefix"
                        disabled={readOnly || loading}
                        {...register('identifier')}
                    />
                </FormItem>
            </div>
        </Card>
    )
}

export default OverviewSection
