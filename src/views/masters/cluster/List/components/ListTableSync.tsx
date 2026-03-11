/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import Button from '@/components/ui/Button'
import Drawer from '@/components/ui/Drawer'
import { Form, FormItem } from '@/components/ui/Form'
import { DatePicker, Select } from '@/components/ui'
import { TbBolt } from 'react-icons/tb'

import useLabList from '@/views/masters/lab/List/hooks/useList'
import useLabClusters from '../hooks/useLabClusters'
import useClusterList from '../hooks/useList'

import { apiAppendLabClusterToMaster } from '@/services/ClusterService'
import useSync from '@/utils/hooks/useSync'

import { mapToOptions } from '@/helpers/optionMappers'
import { Option } from '@/@types/common'
import useLabZones from '@/views/masters/zone/List/hooks/useLabZones'

interface FormSchema {
    labs: number[]
    zone?: number
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

const ClusterListTableSync = () => {
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [selectedIds, setSelectedIds] = useState<number[]>([])

    const { labList = [] } = useLabList()
    const { mutate } = useClusterList()
    const { start, end } = getDefaultDates()

    const { control, watch, reset, setValue } = useForm<FormSchema>({
        defaultValues: {
            labs: [],
            zone: undefined,
            start_date: start,
            end_date: end,
        },
    })

    const labId = watch('labs')?.[0]
    const zoneId = watch('zone')
    const startDate = watch('start_date')
    const endDate = watch('end_date')

    const { data: zones = [], isLoading: zoneLoading } = useLabZones({
        id: labId,
        key: 'all',
    })

    const { data: clusters = [], isLoading: loading } = useLabClusters({
        id: labId,
        zoneId: zoneId,
        start_date: startDate,
        end_date: endDate,
    })

    const { submitting, applySync } = useSync({
        mutate,
        appendApi: apiAppendLabClusterToMaster,
        onDependencyConfirm: async () => {
            return window.confirm(
                'Parent zone not appended. Append both zone and clusters?',
            )
        },
    })

    const labOptions: Option[] = useMemo(
        () =>
            mapToOptions(labList, {
                value: 'id',
                label: (l) => l.name.toUpperCase(),
            }),
        [labList],
    )

    const zoneOptions: Option[] = useMemo(
        () =>
            mapToOptions(zones, {
                value: 'id',
                label: (c: any) => c.name,
            }),
        [zones],
    )

    const clusterOptions: Option[] = useMemo(
        () =>
            clusters.map((s: any) => ({
                value: Number(s.id),
                label: s.name,
            })),
        [clusters],
    )

    const handleApply = async () => {
        await applySync(selectedIds)
        handleDrawerClose()
    }

    const handleDrawerOpen = () => {
        const { start, end } = getDefaultDates()

        reset({
            labs: [],
            zone: undefined,
            start_date: start,
            end_date: end,
        })

        setSelectedIds([])
        setDrawerOpen(true)
    }

    const handleDrawerClose = () => {
        setDrawerOpen(false)
        reset({ labs: [], zone: undefined })
        setSelectedIds([])
    }

    const handleReset = () => {
        reset({
            labs: [],
            zone: undefined,
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
                title="Sync Cluster"
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
                            <FormItem label="Lab">
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
                                                    setValue('zone', undefined)
                                                    setSelectedIds([])
                                                }}
                                            />
                                        )
                                    }}
                                />
                            </FormItem>

                            <FormItem label="Zone">
                                <Controller
                                    name="zone"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            isDisabled={!labId}
                                            isLoading={zoneLoading}
                                            options={zoneOptions}
                                            value={
                                                zoneOptions.find(
                                                    (o) =>
                                                        o.value === field.value,
                                                ) ?? null
                                            }
                                            onChange={(opt) => {
                                                field.onChange(opt?.value)
                                                setSelectedIds([])
                                            }}
                                        />
                                    )}
                                />
                            </FormItem>

                            <FormItem label="Cluster">
                                <Select
                                    isMulti
                                    isDisabled={!zoneId}
                                    isLoading={loading}
                                    options={clusterOptions}
                                    value={clusterOptions.filter((o: any) =>
                                        selectedIds.includes(o.value),
                                    )}
                                    onChange={(values: any) =>
                                        setSelectedIds(
                                            values.map((v: any) =>
                                                Number(v.value),
                                            ),
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

export default ClusterListTableSync
