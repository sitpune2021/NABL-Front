import { useMemo, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import Button from '@/components/ui/Button'
import Drawer from '@/components/ui/Drawer'
import { Form, FormItem } from '@/components/ui/Form'
import { Select } from '@/components/ui'
import { TbFilter } from 'react-icons/tb'
import useLabList from '@/views/masters/lab/List/hooks/useList'
import useLabCategories from '../hooks/useLabCategories'
import { apiAppendLabCategoryToMaster } from '@/services/CategoriesService'
import { useCategoryList } from '../hooks/useList'

type FormSchema = {
    labs: number[]
}

const CategoryListTableFilter = () => {
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([])
    const [submitting, setSubmitting] = useState(false)

    const { labList = [] } = useLabList()
    const { categoryList = [], mutate } = useCategoryList()

    const { control, watch, reset } = useForm<FormSchema>({
        defaultValues: { labs: [] },
    })

    const selectedLabId = watch('labs')[0]

    const { categories = [], loading } = useLabCategories(selectedLabId)

    const labOptions = useMemo(
        () =>
            labList.map((lab) => ({
                value: lab.id,
                label: lab.name.toUpperCase(),
            })),
        [labList],
    )

    const appendedParentIds = useMemo(
        () =>
            new Set(
                categoryList.filter((c) => c.parent_id).map((c) => c.parent_id),
            ),
        [categoryList],
    )

    const categoryOptions = useMemo(
        () =>
            categories
                .filter((c) => !appendedParentIds.has(c.id))
                .map((c) => ({
                    value: c.id,
                    label: c.name,
                })),
        [categories, appendedParentIds],
    )

    const handleApply = async () => {
        if (!selectedCategoryIds.length) {
            handleDrawerClose()
            return
        }

        try {
            setSubmitting(true)

            await Promise.all(
                selectedCategoryIds.map((id) =>
                    apiAppendLabCategoryToMaster(id),
                ),
            )

            mutate()
            handleDrawerClose()
        } catch (err) {
            console.error('Append failed', err)
        } finally {
            setSubmitting(false)
        }
    }

    const handleDrawerClose = () => {
        setDrawerOpen(false)
        reset({ labs: [] })
        setSelectedCategoryIds([])
    }

    const handleReset = () => {
        reset({ labs: [] })
        setSelectedCategoryIds([])
    }

    return (
        <>
            <Button icon={<TbFilter />} onClick={() => setDrawerOpen(true)}>
                Filter
            </Button>

            <Drawer
                title="Select Labs"
                isOpen={drawerOpen}
                onClose={handleDrawerClose}
                onRequestClose={() => setDrawerOpen(false)}
            >
                <Form className="h-full flex flex-col justify-between">
                    <FormItem label="Labs">
                        <Controller
                            name="labs"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    placeholder="Select Lab"
                                    options={labOptions}
                                    value={labOptions.find(
                                        (o) => o.value === field.value?.[0],
                                    )}
                                    onChange={(opt) => {
                                        field.onChange(opt ? [opt.value] : [])
                                        setSelectedCategoryIds([])
                                    }}
                                />
                            )}
                        />
                    </FormItem>

                    <FormItem label="Categories">
                        <Select
                            key={selectedLabId ?? 'no-lab'}
                            isMulti
                            options={categoryOptions}
                            isLoading={loading}
                            isDisabled={!selectedLabId}
                            placeholder={
                                loading
                                    ? 'Loading...'
                                    : categoryOptions.length
                                      ? 'Select Categories'
                                      : 'No categories found'
                            }
                            onChange={(values) =>
                                setSelectedCategoryIds(
                                    values.map((v) => v.value),
                                )
                            }
                        />
                    </FormItem>

                    <div className="flex justify-end gap-2">
                        <Button
                            type="button"
                            disabled={submitting}
                            onClick={handleReset}
                        >
                            Reset
                        </Button>

                        <Button
                            type="button"
                            variant="solid"
                            loading={submitting}
                            onClick={handleApply}
                        >
                            Apply
                        </Button>
                    </div>
                </Form>
            </Drawer>
        </>
    )
}

export default CategoryListTableFilter
