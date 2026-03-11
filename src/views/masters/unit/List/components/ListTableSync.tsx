import { useMemo, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import Button from '@/components/ui/Button'
import Drawer from '@/components/ui/Drawer'
import { Form, FormItem } from '@/components/ui/Form'
import { Select } from '@/components/ui'
import { TbBolt } from 'react-icons/tb'
import useLabList from '@/views/masters/lab/List/hooks/useList'
import useLabUnits from '../hooks/useLabUnits'
import { apiAppendLabUnitToMaster } from '@/services/UnitService'
import useUnitList from '../hooks/useList'
import { useAuth } from '@/auth'

type FormSchema = {
    labs: number[]
}

const UnitListTableSync = () => {
    const { user } = useAuth()

    if (!user) return null
    const isMasterLevel = user.role_type === 'one_step'

    if (!isMasterLevel) return null

    const [drawerOpen, setDrawerOpen] = useState(false)
    const [selectedUnitIds, setSelectedUnitIds] = useState<number[]>([])
    const [submitting, setSubmitting] = useState(false)

    const { labList = [] } = useLabList()
    const { unitList = [], mutate } = useUnitList()

    const { control, watch, reset } = useForm<FormSchema>({
        defaultValues: { labs: [] },
    })

    const selectedLabId = watch('labs')[0]

    const { units = [], loading } = useLabUnits(selectedLabId)

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
                unitList.filter((c) => c.parent_id).map((c) => c.parent_id),
            ),
        [unitList],
    )

    const unitOptions = useMemo(
        () =>
            units
                .filter((c) => !appendedParentIds.has(c.id))
                .map((c) => ({
                    value: c.id,
                    label: c.name,
                })),
        [units, appendedParentIds],
    )

    const handleApply = async () => {
        if (!selectedUnitIds.length) {
            handleDrawerClose()
            return
        }

        try {
            setSubmitting(true)

            await Promise.all(
                selectedUnitIds.map((id) => apiAppendLabUnitToMaster(id)),
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
        setSelectedUnitIds([])
    }

    const handleReset = () => {
        reset({ labs: [] })
        setSelectedUnitIds([])
    }

    return (
        <>
            <Button icon={<TbBolt />} onClick={() => setDrawerOpen(true)}>
                Sync
            </Button>

            <Drawer
                title="Sync Units"
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
                                                    setSelectedUnitIds([])
                                                }}
                                            />
                                        )
                                    }}
                                />
                            </FormItem>

                            <FormItem label="Units" className="mb-0">
                                <Select
                                    key={selectedLabId ?? 'no-lab'}
                                    isMulti
                                    options={unitOptions}
                                    isLoading={loading}
                                    isDisabled={!selectedLabId}
                                    placeholder={
                                        loading
                                            ? 'Loading...'
                                            : unitOptions.length
                                              ? 'Select Units'
                                              : 'No units found'
                                    }
                                    onChange={(values) =>
                                        setSelectedUnitIds(
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

export default UnitListTableSync
