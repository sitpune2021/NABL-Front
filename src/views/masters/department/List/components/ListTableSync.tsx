import { useMemo, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import Button from '@/components/ui/Button'
import Drawer from '@/components/ui/Drawer'
import { Form, FormItem } from '@/components/ui/Form'
import { Select } from '@/components/ui'
import { TbBolt } from 'react-icons/tb'
import useLabList from '@/views/masters/lab/List/hooks/useList'
import useLabDepartments from '../hooks/useLabDepartments'
import { apiAppendLabDepartmentToMaster } from '@/services/DepartmentService'
import useDepartmentList from '../hooks/useList'
import { useAuth } from '@/auth'

type FormSchema = {
    labs: number[]
}

const DepartmentListTableSync = () => {
    const { user } = useAuth()

    if (!user) return null
    const isMasterLevel = user.lab === null
    if (!isMasterLevel) return null

    const [drawerOpen, setDrawerOpen] = useState(false)
    const [selectedDepartmentIds, setSelectedDepartmentIds] = useState<
        number[]
    >([])
    const [submitting, setSubmitting] = useState(false)

    const { labList = [] } = useLabList()
    const { mutate } = useDepartmentList()

    const { control, watch, reset } = useForm<FormSchema>({
        defaultValues: { labs: [] },
    })

    const selectedLabId = watch('labs')[0]

    const {
        departments = [],
        setDepartments,
        loading,
    } = useLabDepartments(selectedLabId)

    const labOptions = useMemo(
        () =>
            labList.map((lab) => ({
                value: lab.id,
                label: lab.name.toUpperCase(),
            })),
        [labList],
    )

    const departmentOptions = useMemo(
        () =>
            departments.map((d) => ({
                value: d.id,
                label: d.name,
            })),
        [departments],
    )

    const handleApply = async () => {
        if (!selectedDepartmentIds.length) {
            handleDrawerClose()
            return
        }

        try {
            setSubmitting(true)

            await Promise.all(
                selectedDepartmentIds.map((id) =>
                    apiAppendLabDepartmentToMaster(id),
                ),
            )
            setDepartments((prev) =>
                prev.filter((t) => !selectedDepartmentIds.includes(t.id)),
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
        setSelectedDepartmentIds([])
    }

    const handleReset = () => {
        reset({ labs: [] })
        setSelectedDepartmentIds([])
    }

    return (
        <>
            <Button icon={<TbBolt />} onClick={() => setDrawerOpen(true)}>
                Sync
            </Button>

            <Drawer
                title="Sync Departments"
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
                                                    setSelectedDepartmentIds([])
                                                }}
                                            />
                                        )
                                    }}
                                />
                            </FormItem>

                            <FormItem label="Departments" className="mb-0">
                                <Select
                                    key={selectedLabId ?? 'no-lab'}
                                    isMulti
                                    options={departmentOptions}
                                    isLoading={loading}
                                    isDisabled={!selectedLabId}
                                    placeholder={
                                        loading
                                            ? 'Loading...'
                                            : departmentOptions.length
                                              ? 'Select Departments'
                                              : 'No departments found'
                                    }
                                    onChange={(values) =>
                                        setSelectedDepartmentIds(
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

export default DepartmentListTableSync
