import { useState } from 'react'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import Checkbox from '@/components/ui/Checkbox'
import Input from '@/components/ui/Input'
import { Form, FormItem } from '@/components/ui/Form'
import { TbFilter } from 'react-icons/tb'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import useTemplateList from '../hooks/useList'

type FormSchema = {
    purchasedProducts: string
    purchaseChannel: Array<string>
}

const channelList = [
    'all',
    'header',
    'footer',
    'draft',
    'draft-header',
    'draft-footer',
    'archived-all',
    'archived-header',
    'archived-footer',
]

const validationSchema = z.object({
    purchasedProducts: z.string(),
    purchaseChannel: z.array(z.string()),
})

const TemplateListTableFilter = () => {
    const [dialogIsOpen, setIsOpen] = useState(false)

    const { filterData, setFilterData } = useTemplateList()

    const openDialog = () => {
        setIsOpen(true)
    }

    const onDialogClose = () => {
        setIsOpen(false)
    }

    const { handleSubmit, reset, control } = useForm<FormSchema>({
        defaultValues: filterData,
        resolver: zodResolver(validationSchema),
    })

    const onSubmit = (values: FormSchema) => {
        setFilterData(values)
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
                        <FormItem label="Products">
                            <Controller
                                name="purchasedProducts"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        type="text"
                                        autoComplete="off"
                                        placeholder="Search by purchased product"
                                        {...field}
                                    />
                                )}
                            />
                        </FormItem>
                        <FormItem label="Purchase Channel">
                            <Controller
                                name="purchaseChannel"
                                control={control}
                                render={({ field }) => (
                                    <Checkbox.Group
                                        vertical
                                        className="flex mt-4"
                                        {...field}
                                    >
                                        {channelList.map((source, index) => (
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
                            <Button type="button" onClick={() => reset()}>
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
