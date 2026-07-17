import { useMemo, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import { Form, FormItem } from '@/components/ui/Form'
import { TbFilter } from 'react-icons/tb'
import { useCategoryOptions } from '@/views/masters/category/List/hooks/useList'
import useSubCategoryList from '../hooks/useList'
import { Select } from '@/components/ui'
import { SELECT_ALL_VALUE } from '@/constants/common.constant'

const schema = z.object({
    categories: z.array(z.union([z.number(), z.string()])),
})

export type FormSchema = z.infer<typeof schema>

const SubCategoryListTableFilter = () => {
    const [dialogIsOpen, setIsOpen] = useState(false)

    const { filterData, updateFilters, resetFilters } = useSubCategoryList()
    const { categoryList, hasMore, isLoading, tableData, updateTable } =
        useCategoryOptions()

    const options = useMemo(() => {
        const categoryOptions = categoryList.map((c) => ({
            value: c.id,
            label: `${c.name.toUpperCase()} - ${c.identifier}`,
        }))

        return [
            { value: SELECT_ALL_VALUE, label: 'Select All' },
            ...categoryOptions,
        ]
    }, [categoryList])

    const openDialog = () => {
        reset(filterData)
        setIsOpen(true)
    }

    const onDialogClose = () => {
        setIsOpen(false)
    }

    const { handleSubmit, reset, control } = useForm<FormSchema>({
        defaultValues: filterData,
        resolver: zodResolver(schema),
    })

    const onReset = () => {
        resetFilters()
        reset({ categories: [] })
        setIsOpen(false)
    }

    const onSubmit = (values: FormSchema) => {
        updateFilters(values)
        setIsOpen(false)
    }

    return (
        <>
            <Button icon={<TbFilter />} onClick={openDialog}>
                Filter
            </Button>

            <Dialog
                isOpen={dialogIsOpen}
                onClose={onDialogClose}
                onRequestClose={onDialogClose}
            >
                <h4 className="mb-4">Filter</h4>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <FormItem label="Categories">
                        <Controller
                            name="categories"
                            control={control}
                            render={({ field }) => {
                                const allCategoryIds = categoryList.map(
                                    (c) => c.id,
                                )
                                const isAllSelected =
                                    field.value?.length ===
                                    allCategoryIds.length

                                return (
                                    <Select
                                        isMulti
                                        placeholder="Select Categories"
                                        options={options}
                                        isLoading={isLoading}
                                        value={options.filter((o) =>
                                            o.value === SELECT_ALL_VALUE
                                                ? isAllSelected
                                                : field.value?.includes(
                                                      o.value,
                                                  ),
                                        )}
                                        onMenuScrollToBottom={() => {
                                            if (hasMore && !isLoading) {
                                                updateTable({
                                                    pageIndex:
                                                        (tableData.pageIndex ??
                                                            1) + 1,
                                                })
                                            }
                                        }}
                                        onChange={(selected) => {
                                            const values =
                                                selected?.map((s) => s.value) ||
                                                []

                                            if (
                                                values.includes(
                                                    SELECT_ALL_VALUE,
                                                )
                                            ) {
                                                field.onChange(
                                                    isAllSelected
                                                        ? []
                                                        : allCategoryIds,
                                                )
                                                return
                                            }

                                            field.onChange(values)
                                        }}
                                    />
                                )
                            }}
                        />
                    </FormItem>
                    <div className="flex justify-end items-center gap-2 mt-4">
                        <Button type="button" onClick={onReset}>
                            Reset
                        </Button>
                        <Button type="submit" variant="solid">
                            Apply
                        </Button>
                    </div>
                </Form>
            </Dialog>
        </>
    )
}

export default SubCategoryListTableFilter
