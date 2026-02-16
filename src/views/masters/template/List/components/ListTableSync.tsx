import { useMemo, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import Button from '@/components/ui/Button'
import Drawer from '@/components/ui/Drawer'
import { Form, FormItem } from '@/components/ui/Form'
import { Select } from '@/components/ui'
import { TbBolt } from 'react-icons/tb'
import useLabList from '@/views/masters/lab/List/hooks/useList'
import useLabTemplates from '../hooks/useLabTemplates'
import { apiAppendLabTemplateToMaster } from '@/services/TemplateService'
import useTemplateList from '../hooks/useList'
import { useAuth } from '@/auth'

type FormSchema = {
    labs: number[]
}

const TemplateListTableSync = () => {
    const { user } = useAuth()

    if (!user) return null
    const isMasterLevel = user.lab === null
    if (!isMasterLevel) return null

    const [drawerOpen, setDrawerOpen] = useState(false)
    const [selectedTemplateIds, setSelectedTemplateIds] = useState<number[]>([])
    const [submitting, setSubmitting] = useState(false)

    const { labList = [] } = useLabList()
    const { mutate } = useTemplateList()

    const { control, watch, reset } = useForm<FormSchema>({
        defaultValues: { labs: [] },
    })

    const selectedLabId = watch('labs')[0]

    const {
        templates = [],
        setTemplates,
        loading,
    } = useLabTemplates(selectedLabId)

    const labOptions = useMemo(
        () =>
            labList.map((lab) => ({
                value: lab.id,
                label: lab.name.toUpperCase(),
            })),
        [labList],
    )

    const templateOptions = useMemo(
        () =>
            templates.map((c) => ({
                value: c.id,
                label: c.name,
            })),
        [templates],
    )

    const handleApply = async () => {
        if (!selectedTemplateIds.length) {
            handleDrawerClose()
            return
        }

        try {
            setSubmitting(true)

            await Promise.all(
                selectedTemplateIds.map((id) =>
                    apiAppendLabTemplateToMaster(id),
                ),
            )

            setTemplates((prev) =>
                prev.filter((t) => !selectedTemplateIds.includes(t.id)),
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
        setSelectedTemplateIds([])
    }

    const handleReset = () => {
        reset({ labs: [] })
        setSelectedTemplateIds([])
    }

    return (
        <>
            <Button icon={<TbBolt />} onClick={() => setDrawerOpen(true)}>
                Sync
            </Button>

            <Drawer
                title="Sync Templates"
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
                                                    setSelectedTemplateIds([])
                                                }}
                                            />
                                        )
                                    }}
                                />
                            </FormItem>

                            <FormItem label="Templates" className="mb-0">
                                <Select
                                    key={selectedLabId ?? 'no-lab'}
                                    isMulti
                                    options={templateOptions}
                                    isLoading={loading}
                                    isDisabled={!selectedLabId}
                                    placeholder={
                                        loading
                                            ? 'Loading...'
                                            : templateOptions.length
                                              ? 'Select Templates'
                                              : 'No templates found'
                                    }
                                    onChange={(values) =>
                                        setSelectedTemplateIds(
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

export default TemplateListTableSync
