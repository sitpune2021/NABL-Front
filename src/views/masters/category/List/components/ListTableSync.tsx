/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import Button from '@/components/ui/Button'
import Drawer from '@/components/ui/Drawer'
import { Form, FormItem } from '@/components/ui/Form'
import { Select } from '@/components/ui'
import { TbBolt } from 'react-icons/tb'

import useLabList from '@/views/masters/lab/List/hooks/useList'
import useLabCategories from '../hooks/useLabCategories'
import { apiAppendLabCategoryToMaster } from '@/services/CategoriesService'
import { useCategoryList } from '../hooks/useList'

import useSync from '@/utils/hooks/useSync'
import { mapToOptions } from '@/helpers/optionMappers'
import { Option } from '@/@types/common'

interface FormSchema {
    labs: number[]
}

const CategoryListTableSync = () => {
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [selectedIds, setSelectedIds] = useState<number[]>([])

    const { labList = [] } = useLabList()
    const { mutate } = useCategoryList()

    const { control, watch, reset } = useForm<FormSchema>({
        defaultValues: { labs: [] },
    })

    const labId = watch('labs')?.[0]

    const { data, isLoading } = useLabCategories({ id: labId })

    // 🔥 GENERIC SYNC
    const { submitting, applySync } = useSync({
        mutate,
        appendApi: apiAppendLabCategoryToMaster,
    })

    const labOptions: Option[] = useMemo(
        () =>
            mapToOptions(labList, {
                value: 'id',
                label: (l) => l.name.toUpperCase(),
            }),
        [labList],
    )

    const categoryOptions: Option[] = useMemo(
        () =>
            mapToOptions(data ?? [], {
                value: 'id',
                label: (c: any) => c.name,
            }),
        [data],
    )

    const handleApply = async () => {
        await applySync(selectedIds)
        handleDrawerClose()
    }

    const handleDrawerClose = () => {
        setDrawerOpen(false)
        setSelectedIds([])
    }

    const handleReset = () => {
        reset({ labs: [] })
        setSelectedIds([])
    }

    return (
        <>
            <Button icon={<TbBolt />} onClick={() => setDrawerOpen(true)}>
                Sync
            </Button>

            <Drawer
                title="Sync Categories"
                isOpen={drawerOpen}
                bodyClass="p-0 h-full"
                onClose={handleDrawerClose}
                onRequestClose={handleDrawerClose}
            >
                <div className="flex flex-col h-[calc(99vh-60px)]">
                    <div className="flex-1 p-6 overflow-y-auto">
                        <Form>
                            <FormItem label="Labs">
                                <Controller
                                    name="labs"
                                    control={control}
                                    render={({ field }) => {
                                        const selected = field.value?.[0]

                                        return (
                                            <Select
                                                placeholder="Select Lab"
                                                options={labOptions}
                                                value={
                                                    labOptions.find(
                                                        (o) =>
                                                            o.value ===
                                                            selected,
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
                                                    setSelectedIds([])
                                                }}
                                            />
                                        )
                                    }}
                                />
                            </FormItem>

                            <FormItem label="Categories">
                                <Select
                                    key={labId ?? 'no-lab'}
                                    isMulti
                                    options={categoryOptions}
                                    isLoading={isLoading}
                                    isDisabled={!labId}
                                    onChange={(values: any) =>
                                        setSelectedIds(
                                            values.map((v: any) => v.value),
                                        )
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

export default CategoryListTableSync
