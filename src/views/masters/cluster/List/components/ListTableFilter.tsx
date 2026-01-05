/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo } from 'react'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import { Form, FormItem } from '@/components/ui/Form'
import { TbFilter } from 'react-icons/tb'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import useClusterList from '../hooks/useList'
import { useZoneList } from '@/views/masters/zone/List/hooks/useList'
import { SELECT_ALL_VALUE } from '@/constants/common.constant'
import { Select } from '@/components/ui'

const schema = z.object({
    zones: z.array(z.number()),
})

export type FormSchema = z.infer<typeof schema>

const ClusterListTableFilter = () => {
    const [dialogIsOpen, setIsOpen] = useState(false)

    const { filterData, updateFilters, resetFilters } = useClusterList()
    const { zoneList } = useZoneList()

    const options = useMemo(() => {
        const zoneOptions = zoneList.map((zone) => ({
            value: zone.id,
            label: `${zone.name.toUpperCase()} - ${zone.identifier}`,
        }))

        return [
            { value: SELECT_ALL_VALUE, label: 'Select All' },
            ...zoneOptions,
        ]
    }, [zoneList])

    const { handleSubmit, reset, control } = useForm<FormSchema>({
        defaultValues: filterData,
        resolver: zodResolver(schema),
    })

    const openDialog = () => {
        reset(filterData)
        setIsOpen(true)
    }

    const onDialogClose = () => {
        setIsOpen(false)
    }

    const onReset = () => {
        resetFilters()
        reset({ zones: [] })
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
                    <FormItem label="Zone">
                        <Controller
                            name="zones"
                            control={control}
                            render={({ field }) => {
                                const allZoneIds = zoneList.map((z) => z.id)

                                const isAllSelected =
                                    field.value?.length === allZoneIds.length

                                return (
                                    <Select
                                        isMulti
                                        placeholder="Select Zone"
                                        options={options}
                                        value={options.filter((o: any) =>
                                            o.value === SELECT_ALL_VALUE
                                                ? isAllSelected
                                                : field.value?.includes(
                                                      o.value,
                                                  ),
                                        )}
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
                                                        : allZoneIds,
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

export default ClusterListTableFilter
