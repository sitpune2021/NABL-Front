/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import Button from '@/components/ui/Button'
import Drawer from '@/components/ui/Drawer'
import { Form, FormItem } from '@/components/ui/Form'
import { DatePicker, Select } from '@/components/ui'
import { TbBolt } from 'react-icons/tb'
import useLabList from '@/views/masters/lab/List/hooks/useList'
import useLabUnits from '../hooks/useLabUnits'
import { apiAppendLabUnitToMaster } from '@/services/UnitService'
import useUnitList from '../hooks/useList'
import useSync from '@/utils/hooks/useSync'
import { mapToOptions } from '@/helpers/optionMappers'
import { Option } from '@/@types/common'

interface FormSchema {
    labs: number[]
    start_date: string | null
    end_date: string | null
}
const formatDate = (date: Date) => {
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
}

const getDefaultDates = () => {
    const today = new Date()

    const end = formatDate(today)

    const oneMonthBefore = new Date()
    oneMonthBefore.setMonth(oneMonthBefore.getMonth() - 1)

    const start = formatDate(oneMonthBefore)

    return { start, end }
}

const UnitListTableSync = () => {
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [selectedIds, setSelectedIds] = useState<number[]>([])

    const { labList = [] } = useLabList()
    const { mutate } = useUnitList()
    const { start, end } = getDefaultDates()

    const { control, watch, reset } = useForm<FormSchema>({
        defaultValues: { labs: [], start_date: start, end_date: end },
    })

    const labId = watch('labs')?.[0]
    const startDate = watch('start_date')
    const endDate = watch('end_date')

    const { data, isLoading } = useLabUnits({
        id: labId,
        start_date: startDate,
        end_date: endDate,
    })

    // 🔥 GENERIC SYNC
    const { submitting, applySync } = useSync({
        mutate,
        appendApi: apiAppendLabUnitToMaster,
    })

    const labOptions: Option[] = useMemo(
        () =>
            mapToOptions(labList, {
                value: 'id',
                label: (l) => l.name.toUpperCase(),
            }),
        [labList],
    )

    const unitOptions: Option[] = useMemo(
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
    const handleDrawerOpen = () => {
        const { start, end } = getDefaultDates()

        reset({
            labs: [],
            start_date: start,
            end_date: end,
        })

        setSelectedIds([])
        setDrawerOpen(true)
    }

    const handleDrawerClose = () => {
        setDrawerOpen(false)
        setSelectedIds([])
    }

    const handleReset = () => {
        const { start, end } = getDefaultDates()

        reset({
            labs: [],
            start_date: start,
            end_date: end,
        })

        setSelectedIds([])
    }

    return (
        <>
            <Button icon={<TbBolt />} onClick={handleDrawerOpen}>
                Sync
            </Button>

            <Drawer
                title="Sync Units"
                isOpen={drawerOpen}
                bodyClass="p-0 h-full"
                onClose={handleDrawerClose}
                onRequestClose={handleDrawerClose}
            >
                <div className="flex flex-col h-[calc(99vh-60px)]">
                    <div className="flex-1 p-6 overflow-y-auto">
                        <Form>
                            <FormItem label="Start Date">
                                <Controller
                                    name="start_date"
                                    control={control}
                                    render={({ field }) => (
                                        <DatePicker
                                            value={
                                                field.value
                                                    ? new Date(field.value)
                                                    : null
                                            }
                                            onChange={(date: any) => {
                                                if (!date)
                                                    return field.onChange(null)
                                                field.onChange(formatDate(date))
                                            }}
                                        />
                                    )}
                                />
                            </FormItem>

                            <FormItem label="End Date">
                                <Controller
                                    name="end_date"
                                    control={control}
                                    render={({ field }) => (
                                        <DatePicker
                                            value={
                                                field.value
                                                    ? new Date(field.value)
                                                    : null
                                            }
                                            minDate={
                                                startDate
                                                    ? new Date(startDate)
                                                    : undefined
                                            }
                                            onChange={(date: any) => {
                                                if (!date)
                                                    return field.onChange(null)
                                                field.onChange(formatDate(date))
                                            }}
                                        />
                                    )}
                                />
                            </FormItem>

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

                            <FormItem label="Units">
                                <Select
                                    key={labId ?? 'no-lab'}
                                    isMulti
                                    options={unitOptions}
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

export default UnitListTableSync
