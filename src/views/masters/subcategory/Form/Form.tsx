import Container from '@/components/shared/Container'
import BottomStickyBar from '@/components/template/BottomStickyBar'
import type { CommonProps } from '@/@types/common'
import {
    SubCategoryFormSchema,
    subCategorySchema,
} from '@/schemas/sub_category.schema'
import MasterForm from '@/components/form/MasterForm'
import FormSectionLayout from '@/components/layouts/FormSectionLayout'
import PrefixSelectField from '@/components/form/fields/PrefixSelectField'
import { useCategoryOptions } from '../../category/List/hooks/useList'
import { useCategoryDetail } from '../../category/List/hooks/useCategoryDetail'
import TextField from '@/components/form/fields/TextField'
import { FormItem, Input } from '@/components/ui'
import { useEffect, useMemo } from 'react'
import { useFormContext, useFormState } from 'react-hook-form'

const getSuffix = (identifier = '', prefix = '') => {
    if (!identifier) {
        return ''
    }

    if (prefix && identifier.startsWith(`${prefix}-`)) {
        return identifier.slice(prefix.length + 1)
    }

    return identifier.split('-').slice(1).join('-') || identifier
}

const SubCategoryIdentifierField = ({ readOnly }: { readOnly: boolean }) => {
    const { watch, setValue, control } = useFormContext<SubCategoryFormSchema>()
    const catId = watch('cat_id')
    const identifier = watch('identifier') || ''
    const { data: category } = useCategoryDetail(
        catId ? String(catId) : undefined,
    )
    const categoryPrefix = category?.identifier || ''
    const suffix = useMemo(
        () => getSuffix(identifier, categoryPrefix),
        [identifier, categoryPrefix],
    )

    const { errors } = useFormState({
        control,
        name: 'identifier',
    })
    const error = errors.identifier

    useEffect(() => {
        if (!categoryPrefix) {
            return
        }

        setValue(
            'identifier',
            suffix ? `${categoryPrefix}-${suffix}` : `${categoryPrefix}-`,
            {
                shouldDirty: true,
                shouldValidate: false,
            },
        )
    }, [categoryPrefix, setValue, suffix])

    return (
        <FormItem
            label="Prefix"
            invalid={!!error}
            errorMessage={error?.message}
        >
            <div className="grid grid-cols-[minmax(80px,140px)_24px_1fr] items-center gap-2">
                <Input disabled value={categoryPrefix} />
                <div className="text-center font-semibold text-gray-500">-</div>
                <Input
                    value={suffix}
                    disabled={readOnly || !categoryPrefix}
                    placeholder="Enter own prefix"
                    onChange={(event) => {
                        const nextSuffix = event.target.value
                        setValue(
                            'identifier',
                            nextSuffix
                                ? `${categoryPrefix}-${nextSuffix}`
                                : `${categoryPrefix}-`,
                            {
                                shouldDirty: true,
                                shouldValidate: true,
                            },
                        )
                    }}
                />
            </div>
        </FormItem>
    )
}

type SubCategoryFormProps = {
    onFormSubmit: (values: SubCategoryFormSchema) => void
    defaultValues: SubCategoryFormSchema
    readOnly?: boolean
} & CommonProps

const SubCategoryForm = ({
    onFormSubmit,
    defaultValues,
    readOnly = false,
    children,
}: SubCategoryFormProps) => {
    const isEditMode = Boolean(defaultValues?.cat_id)
    return (
        <MasterForm
            schema={subCategorySchema}
            defaultValues={defaultValues}
            onSubmit={onFormSubmit}
        >
            <Container>
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="gap-4 flex flex-col flex-auto">
                        <FormSectionLayout title="Sub Category">
                            <PrefixSelectField
                                fieldName="cat_id"
                                identifierField="identifier"
                                label="Category"
                                readOnly={isEditMode || readOnly}
                                useListHook={useCategoryOptions}
                                useDetailHook={useCategoryDetail}
                                mapOption={(item) => ({
                                    value: item.id,
                                    label: item.name.toUpperCase(),
                                    identifier: item.identifier,
                                })}
                            />

                            <TextField
                                name="name"
                                label="Sub Category"
                                placeholder="Enter Sub Category"
                                readOnly={readOnly}
                            />
                            <SubCategoryIdentifierField readOnly={readOnly} />
                        </FormSectionLayout>
                    </div>
                </div>
            </Container>
            <BottomStickyBar>{children}</BottomStickyBar>
        </MasterForm>
    )
}

export default SubCategoryForm
