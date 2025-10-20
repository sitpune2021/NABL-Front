/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react'
import Card from '@/components/ui/Card'
import { FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Checkbox from '@/components/ui/Checkbox'
import { Controller, useFieldArray, useWatch } from 'react-hook-form'
import { HiPlus } from 'react-icons/hi'

const StandardSection = ({ control, errors, readOnly }: any) => {
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'standards',
    })

    const watchedStandards = useWatch({
        control,
        name: 'standards',
        defaultValue: [],
    })

    useEffect(() => {
        if (fields.length === 0) {
            append({
                title: '',
                message: '',
                isNote: false,
                isChild: false,
                count: 0,
                children: [],
            })
        }
    }, [append, fields])

    useEffect(() => {
        if (!watchedStandards) return

        watchedStandards.forEach((standard: any, index: number) => {
            if (standard?.isChild && standard?.count > 0) {
                const currentCount = standard.count || 0
                const currentChildren = standard.children || []

                if (currentCount > currentChildren.length) {
                    const childrenToAdd = currentCount - currentChildren.length
                    const newChildren = [...currentChildren]

                    for (let i = 0; i < childrenToAdd; i++) {
                        newChildren.push({
                            title: '',
                            message: '',
                            isNote: false,
                            isChild: false,
                            count: 0,
                        })
                    }

                    const updatedStandard = {
                        ...standard,
                        children: newChildren,
                    }

                    remove(index)
                    append(updatedStandard, { shouldFocus: false })
                } else if (currentCount < currentChildren.length) {
                    const newChildren = currentChildren.slice(0, currentCount)
                    const updatedStandard = {
                        ...standard,
                        children: newChildren,
                    }

                    remove(index)
                    append(updatedStandard, { shouldFocus: false })
                }
            } else if (
                !standard?.isChild &&
                standard?.children &&
                standard.children.length > 0
            ) {
                const updatedStandard = {
                    ...standard,
                    children: [],
                }

                remove(index)
                append(updatedStandard, { shouldFocus: false })
            }
        })
    }, [watchedStandards, append, remove])

    const handleAddSection = () => {
        append({
            title: '',
            message: '',
            isNote: false,
            isChild: false,
            count: 0,
            children: [],
        })
    }

    const handleAddChildSection = (parentIndex: number) => {
        const currentStandard = watchedStandards[parentIndex]
        const updatedStandard = {
            ...currentStandard,
            count: (currentStandard.count || 0) + 1,
            children: [
                ...(currentStandard.children || []),
                {
                    title: '',
                    message: '',
                    isNote: false,
                    isChild: false,
                    count: 0,
                },
            ],
        }

        remove(parentIndex)
        append(updatedStandard, { shouldFocus: false })
    }

    return (
        <Card>
            <h4 className="mb-6 text-lg font-semibold">Standard</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
                <FormItem
                    label="Name"
                    invalid={Boolean(errors.name)}
                    errorMessage={errors.name?.message}
                >
                    <Controller
                        name="name"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                placeholder="Enter Name"
                                readOnly={readOnly}
                                {...field}
                            />
                        )}
                    />
                </FormItem>

                <FormItem
                    label="Unique Id"
                    invalid={Boolean(errors.id)}
                    errorMessage={errors.id?.message}
                >
                    <Controller
                        name="id"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                placeholder="Enter Unique Id"
                                readOnly={readOnly}
                                {...field}
                            />
                        )}
                    />
                </FormItem>
            </div>

            <div className="flex justify-end mb-4">
                <Button
                    size="sm"
                    type="button"
                    disabled={readOnly}
                    onClick={handleAddSection}
                >
                    <HiPlus className="text-lg" />
                </Button>
            </div>

            {fields.map((field, index) => (
                <div key={field.id} className="border rounded-lg p-4 mb-6">
                    <div className="grid md:grid-cols-2 gap-4">
                        <FormItem
                            label="Title"
                            invalid={Boolean(errors?.standards?.[index]?.title)}
                            errorMessage={
                                errors?.standards?.[index]?.title?.message
                            }
                        >
                            <Controller
                                name={`standards.${index}.title`}
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        type="text"
                                        placeholder="Enter Title"
                                        readOnly={readOnly}
                                        {...field}
                                    />
                                )}
                            />
                        </FormItem>

                        <FormItem
                            label="Message"
                            invalid={Boolean(
                                errors?.standards?.[index]?.message,
                            )}
                            errorMessage={
                                errors?.standards?.[index]?.message?.message
                            }
                        >
                            <Controller
                                name={`standards.${index}.message`}
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        textArea
                                        rows={3}
                                        placeholder="Write your message..."
                                        readOnly={readOnly}
                                        {...field}
                                    />
                                )}
                            />
                        </FormItem>
                    </div>

                    <div className="flex items-center gap-6 flex-wrap mt-4">
                        <FormItem label="Note">
                            <Controller
                                name={`standards.${index}.isNote`}
                                control={control}
                                render={({ field }) => (
                                    <Checkbox
                                        checked={field.value}
                                        disabled={readOnly}
                                        {...field}
                                    />
                                )}
                            />
                        </FormItem>

                        <FormItem label="Child">
                            <Controller
                                name={`standards.${index}.isChild`}
                                control={control}
                                render={({ field }) => (
                                    <Checkbox
                                        checked={field.value}
                                        disabled={readOnly}
                                        {...field}
                                    />
                                )}
                            />
                        </FormItem>

                        <FormItem label="Count">
                            <Controller
                                name={`standards.${index}.count`}
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        type="number"
                                        className="w-24"
                                        placeholder="0"
                                        readOnly={readOnly}
                                        {...field}
                                        onChange={(e) => {
                                            field.onChange(
                                                parseInt(e.target.value) || 0,
                                            )
                                        }}
                                    />
                                )}
                            />
                        </FormItem>
                    </div>

                    {watchedStandards[index]?.isChild &&
                        watchedStandards[index]?.children && (
                            <div className="mt-6 border-t pt-4">
                                <div className="flex justify-between items-center mb-4">
                                    <h5 className="font-semibold">Child</h5>
                                    <Button
                                        size="sm"
                                        type="button"
                                        disabled={readOnly}
                                        onClick={() =>
                                            handleAddChildSection(index)
                                        }
                                    >
                                        <HiPlus className="text-lg" />
                                    </Button>
                                </div>

                                {watchedStandards[index].children.map(
                                    (child: any, childIndex: number) => (
                                        <div
                                            key={childIndex}
                                            className="border rounded-lg p-4 mb-4 bg-gray-50"
                                        >
                                            <div className="grid md:grid-cols-2 gap-4">
                                                <FormItem
                                                    label="Title"
                                                    invalid={Boolean(
                                                        errors?.standards?.[
                                                            index
                                                        ]?.children?.[
                                                            childIndex
                                                        ]?.title,
                                                    )}
                                                    errorMessage={
                                                        errors?.standards?.[
                                                            index
                                                        ]?.children?.[
                                                            childIndex
                                                        ]?.title?.message
                                                    }
                                                >
                                                    <Controller
                                                        name={`standards.${index}.children.${childIndex}.title`}
                                                        control={control}
                                                        render={({ field }) => (
                                                            <Input
                                                                type="text"
                                                                placeholder="Enter Child Title"
                                                                readOnly={
                                                                    readOnly
                                                                }
                                                                {...field}
                                                            />
                                                        )}
                                                    />
                                                </FormItem>

                                                <FormItem
                                                    label="Message"
                                                    invalid={Boolean(
                                                        errors?.standards?.[
                                                            index
                                                        ]?.children?.[
                                                            childIndex
                                                        ]?.message,
                                                    )}
                                                    errorMessage={
                                                        errors?.standards?.[
                                                            index
                                                        ]?.children?.[
                                                            childIndex
                                                        ]?.message?.message
                                                    }
                                                >
                                                    <Controller
                                                        name={`standards.${index}.children.${childIndex}.message`}
                                                        control={control}
                                                        render={({ field }) => (
                                                            <Input
                                                                textArea
                                                                rows={2}
                                                                placeholder="Write child message..."
                                                                readOnly={
                                                                    readOnly
                                                                }
                                                                {...field}
                                                            />
                                                        )}
                                                    />
                                                </FormItem>
                                            </div>

                                            <div className="flex items-center gap-6 flex-wrap mt-4">
                                                <FormItem label="Note">
                                                    <Controller
                                                        name={`standards.${index}.children.${childIndex}.isNote`}
                                                        control={control}
                                                        render={({ field }) => (
                                                            <Checkbox
                                                                checked={
                                                                    field.value
                                                                }
                                                                disabled={
                                                                    readOnly
                                                                }
                                                                {...field}
                                                            />
                                                        )}
                                                    />
                                                </FormItem>

                                                <FormItem label="Child">
                                                    <Controller
                                                        name={`standards.${index}.children.${childIndex}.isChild`}
                                                        control={control}
                                                        render={({ field }) => (
                                                            <Checkbox
                                                                checked={
                                                                    field.value
                                                                }
                                                                disabled={
                                                                    readOnly
                                                                }
                                                                {...field}
                                                            />
                                                        )}
                                                    />
                                                </FormItem>

                                                <FormItem label="Count">
                                                    <Controller
                                                        name={`standards.${index}.children.${childIndex}.count`}
                                                        control={control}
                                                        render={({ field }) => (
                                                            <Input
                                                                type="number"
                                                                className="w-24"
                                                                placeholder="0"
                                                                readOnly={
                                                                    readOnly
                                                                }
                                                                {...field}
                                                                onChange={(
                                                                    e,
                                                                ) => {
                                                                    field.onChange(
                                                                        parseInt(
                                                                            e
                                                                                .target
                                                                                .value,
                                                                        ) || 0,
                                                                    )
                                                                }}
                                                            />
                                                        )}
                                                    />
                                                </FormItem>
                                            </div>
                                        </div>
                                    ),
                                )}
                            </div>
                        )}
                </div>
            ))}
        </Card>
    )
}

export default StandardSection
