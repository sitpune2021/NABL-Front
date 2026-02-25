import { useMemo, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import Button from '@/components/ui/Button'
import Drawer from '@/components/ui/Drawer'
import { Form, FormItem } from '@/components/ui/Form'
import { Select } from '@/components/ui'
import { TbBolt } from 'react-icons/tb'
import useLabList from '@/views/masters/lab/List/hooks/useList'
import useLabCategories from '@/views/masters/category/List/hooks/useLabCategories'
import useLabSubCategories from '../hooks/useLabSubCategories'
import { apiAppendLabSubCategoryToMaster } from '@/services/SubCategoryService'
import useSubCategoryList from '../hooks/useList'
import { useAuth } from '@/auth'

type FormSchema = {
    labs?: number
    category?: number
}

const SubCategoryListTableSync = () => {
    const { user } = useAuth()
    if (!user || user.lab !== null) return null

    const [drawerOpen, setDrawerOpen] = useState(false)
    const [selectedSubCategoryIds, setSelectedSubCategoryIds] = useState<
        number[]
    >([])
    const [submitting, setSubmitting] = useState(false)

    const { labList = [] } = useLabList()
    const { subcategoryList = [], mutate } = useSubCategoryList()

    const { control, watch, reset, setValue } = useForm<FormSchema>({
        defaultValues: {
            labs: undefined,
            category: undefined,
        },
    })

    const selectedLabId = watch('labs')
    const selectedCategoryId = watch('category')

    const { categories = [] } = useLabCategories(selectedLabId, 'all')
    const { subCategories = [], loading } = useLabSubCategories(
        selectedLabId,
        selectedCategoryId,
    )

    const labOptions = useMemo(
        () =>
            labList.map((l) => ({
                value: l.id,
                label: l.name.toUpperCase(),
            })),
        [labList],
    )

    const categoryOptions = useMemo(
        () =>
            categories.map((c) => ({
                value: c.id,
                label: c.name,
            })),
        [categories],
    )

    const appendedSubCategoryIds = useMemo(
        () =>
            new Set(
                subcategoryList
                    .filter(
                        (s) =>
                            Number(s.lab_id) === Number(selectedLabId) &&
                            Number(s.category_id) ===
                                Number(selectedCategoryId),
                    )
                    .map((s) => Number(s.sub_category_id)),
            ),
        [subcategoryList, selectedLabId, selectedCategoryId],
    )

    const subCategoryOptions = useMemo(
        () =>
            subCategories
                .filter((s) => !appendedSubCategoryIds.has(Number(s.id)))
                .map((s) => ({
                    value: Number(s.id),
                    label: s.name,
                })),
        [subCategories, appendedSubCategoryIds],
    )

    const handleApply = async () => {
        if (!selectedSubCategoryIds.length) return handleClose()

        try {
            setSubmitting(true)

            await Promise.all(
                selectedSubCategoryIds.map((id) =>
                    apiAppendLabSubCategoryToMaster(id),
                ),
            )

            mutate()
            handleClose()
        } catch (err) {
            console.error('Append failed', err)
        } finally {
            setSubmitting(false)
        }
    }

    const handleClose = () => {
        setDrawerOpen(false)
        reset()
        setSelectedSubCategoryIds([])
    }

    const handleReset = () => {
        reset()
        setSelectedSubCategoryIds([])
    }

    return (
        <>
            <Button icon={<TbBolt />} onClick={() => setDrawerOpen(true)}>
                Sync
            </Button>

            <Drawer
                title="Sync SubCategories"
                isOpen={drawerOpen}
                bodyClass="p-0 h-full"
                onClose={handleClose}
            >
                <div className="flex flex-col h-[calc(99vh-60px)]">
                    <div className="flex-1 p-6 overflow-y-auto">
                        <Form>
                            <FormItem label="Labs">
                                <Controller
                                    name="labs"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            placeholder="Select Lab"
                                            options={labOptions}
                                            value={labOptions.find(
                                                (o) => o.value === field.value,
                                            )}
                                            onChange={(opt) => {
                                                field.onChange(opt?.value)
                                                setValue('category', undefined)
                                                setSelectedSubCategoryIds([])
                                            }}
                                        />
                                    )}
                                />
                            </FormItem>

                            <FormItem label="Category">
                                <Controller
                                    name="category"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            placeholder="Select Category"
                                            isDisabled={!selectedLabId}
                                            options={categoryOptions}
                                            value={categoryOptions.find(
                                                (o) => o.value === field.value,
                                            )}
                                            onChange={(opt) => {
                                                field.onChange(opt?.value)
                                                setSelectedSubCategoryIds([])
                                            }}
                                        />
                                    )}
                                />
                            </FormItem>

                            <FormItem label="SubCategories">
                                <Select
                                    key={`${selectedLabId}-${selectedCategoryId}`}
                                    isMulti
                                    isDisabled={!selectedCategoryId}
                                    isLoading={loading}
                                    options={subCategoryOptions}
                                    value={subCategoryOptions.filter((o) =>
                                        selectedSubCategoryIds.includes(
                                            o.value,
                                        ),
                                    )}
                                    placeholder={
                                        loading
                                            ? 'Loading...'
                                            : subCategoryOptions.length
                                              ? 'Select SubCategories'
                                              : 'All subcategories already synced'
                                    }
                                    onChange={(values) =>
                                        setSelectedSubCategoryIds([
                                            ...new Set(
                                                values.map((v) =>
                                                    Number(v.value),
                                                ),
                                            ),
                                        ])
                                    }
                                />
                            </FormItem>
                        </Form>
                    </div>

                    <div className="p-4 flex justify-end gap-2">
                        <Button disabled={submitting} onClick={handleReset}>
                            Reset
                        </Button>
                        <Button
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

export default SubCategoryListTableSync
