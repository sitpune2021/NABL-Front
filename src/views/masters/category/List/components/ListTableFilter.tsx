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
import { useAuth } from '@/auth'

type FormSchema = {
    labs: number[]
}

const CategoryListTableFilter = () => {
    const { user } = useAuth()

    if (!user) return null
    const isMasterLevel = user.lab === null
    if (!isMasterLevel) return null

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
                bodyClass="p-0 h-full"
                onClose={handleDrawerClose}
                onRequestClose={() => setDrawerOpen(false)}
            >
                <div className="flex flex-col h-[calc(99vh-60px)]">
                    <div className="flex-1 p-6 overflow-y-auto">
                        <Form>
                            <FormItem label="Labs">
                                <Controller
                                    name="labs"
                                    control={control}
                                    render={({ field }) => {
                                        const selectedLabId = field
                                            .value?.[0] as number | undefined

                                        return (
                                            <Select
                                                placeholder="Select Lab"
                                                options={labOptions}
                                                value={
                                                    labOptions.find(
                                                        (o) =>
                                                            o.value ===
                                                            selectedLabId,
                                                    ) ?? null
                                                }
                                                onChange={(opt) => {
                                                    field.onChange(
                                                        opt
                                                            ? [
                                                                  Number(
                                                                      opt.value,
                                                                  ),
                                                              ]
                                                            : [],
                                                    )
                                                    setSelectedCategoryIds([])
                                                }}
                                            />
                                        )
                                    }}
                                />
                            </FormItem>

                            <FormItem label="Categories" className="mb-0">
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
                        </Form>
                    </div>

                    <div className="p-4 flex justify-end gap-2">
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
                </div>
            </Drawer>
        </>
    )
}

export default CategoryListTableFilter
