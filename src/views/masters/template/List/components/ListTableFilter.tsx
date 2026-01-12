import { useState } from 'react'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import Checkbox from '@/components/ui/Checkbox'
import { Form, FormItem } from '@/components/ui/Form'
import { TbFilter } from 'react-icons/tb'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import useTemplateList from '../hooks/useList'
import { Select } from '@/components/ui'

const statusOptions = [
    { label: 'Draft', value: 'draft' },
    { label: 'Published', value: 'published' },
    { label: 'Archived', value: 'archived' },
]

const typeList = ['header', 'footer']

const schema = z.object({
    status: z.array(z.string()),
    type: z.array(z.string()),
})

export type FormSchema = z.infer<typeof schema>

const TemplateListTableFilter = () => {
    const [dialogIsOpen, setIsOpen] = useState(false)

    const { filterData, updateFilters, resetFilters } = useTemplateList()

    const openDialog = () => {
        reset(filterData)
        setIsOpen(true)
    }

    const onDialogClose = () => {
        setIsOpen(false)
    }

    const { handleSubmit, reset, control } = useForm<FormSchema>({
        defaultValues: filterData,
        resolver: zodResolver(schema),
    })

    const onReset = () => {
        resetFilters()
        reset({ status: [], type: [] })
        setIsOpen(false)
    }

    const onSubmit = (values: FormSchema) => {
        updateFilters(values)
        setIsOpen(false)
    }

    return (
        <>
            <Button icon={<TbFilter />} onClick={() => openDialog()}>
                Filter
            </Button>
            <Dialog
                isOpen={dialogIsOpen}
                onClose={onDialogClose}
                onRequestClose={onDialogClose}
            >
                <div className="max-h-[70vh] overflow-y-auto pr-2">
                    <h4 className="mb-4">Filter</h4>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <FormItem label="Status">
                            <Controller
                                name="status"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        isMulti
                                        placeholder="Select Status"
                                        options={statusOptions}
                                        value={statusOptions.filter((option) =>
                                            field.value?.includes(option.value),
                                        )}
                                        onChange={(selected) =>
                                            field.onChange(
                                                selected.map(
                                                    (item) => item.value,
                                                ),
                                            )
                                        }
                                    />
                                )}
                            />
                        </FormItem>
                        <FormItem label="Type">
                            <Controller
                                name="type"
                                control={control}
                                render={({ field }) => (
                                    <Checkbox.Group
                                        vertical
                                        className="flex mt-4"
                                        {...field}
                                    >
                                        {typeList.map((source, index) => (
                                            <Checkbox
                                                key={source + index}
                                                name={field.name}
                                                value={source}
                                                className="justify-between flex-row-reverse heading-text"
                                            >
                                                {source}
                                            </Checkbox>
                                        ))}
                                    </Checkbox.Group>
                                )}
                            />
                        </FormItem>
                        <div className="flex justify-end items-center gap-2 mt-4">
                            <Button type="button" onClick={() => onReset()}>
                                Reset
                            </Button>
                            <Button type="submit" variant="solid">
                                Apply
                            </Button>
                        </div>
                    </Form>
                </div>
            </Dialog>
        </>
    )
}

export default TemplateListTableFilter
