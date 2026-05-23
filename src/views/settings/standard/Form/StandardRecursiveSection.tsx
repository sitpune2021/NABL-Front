/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useCallback, memo, useState } from 'react'
import {
    FieldArrayPath,
    useFieldArray,
    useFormContext,
    useWatch,
} from 'react-hook-form'
import { HiPlus, HiTrash } from 'react-icons/hi'
import Button from '@/components/ui/Button'
import StandardCard from './StandardCard'
import {
    StandardChildFormSchema,
    StandardFormSchema,
} from '@/schemas/standard.schema'
import { StandardRecursiveSectionProps } from '@/@types/standard'
import { createStandard } from '@/constants/standard.constant'

interface ExtendedSectionProps extends StandardRecursiveSectionProps {
    openItems?: Set<string>
    onToggle?: (itemPath: string) => void
    onExpandAll?: () => void
    onCollapseAll?: () => void
}

const StandardRecursiveSection = ({
    name,
    readOnly,
    isRoot = false,
    depth = 0,
    parentNumber = '',
    openItems: externalOpenItems,
    onToggle: externalOnToggle,
    onExpandAll: externalOnExpandAll,
    onCollapseAll: externalOnCollapseAll,
}: ExtendedSectionProps) => {
    const {
        control,
        setValue,
        getValues,
        formState: { errors },
    } = useFormContext<StandardFormSchema>()
    console.log(errors)

    const [openItems, setOpenItems] = useState<Set<string>>(new Set())
    const activeOpenItems = isRoot ? openItems : externalOpenItems || new Set()

    const handleToggle = useCallback(
        (itemPath: string) => {
            if (isRoot) {
                setOpenItems((prev) => {
                    const newSet = new Set(prev)
                    if (newSet.has(itemPath)) {
                        newSet.delete(itemPath)
                    } else {
                        newSet.add(itemPath)
                    }
                    return newSet
                })
            } else {
                externalOnToggle?.(itemPath)
            }
        },
        [isRoot, externalOnToggle],
    )

    const handleExpandAll = useCallback(() => {
        const allPaths = new Set<string>()

        const collectPaths = (fieldName: string) => {
            const values = getValues(fieldName as any) as any[]
            if (!Array.isArray(values)) return

            values.forEach((item, index) => {
                const itemPath = `${fieldName}.${index}`
                allPaths.add(itemPath)

                if (
                    item?.children &&
                    Array.isArray(item.children) &&
                    item.children.length > 0
                ) {
                    collectPaths(`${itemPath}.children`)
                }
            })
        }

        collectPaths(name)

        if (isRoot) {
            setOpenItems(allPaths)
        } else {
            externalOnExpandAll?.()
        }
    }, [name, getValues, isRoot, externalOnExpandAll])

    const handleCollapseAll = useCallback(() => {
        if (isRoot) {
            setOpenItems(new Set())
        } else {
            externalOnCollapseAll?.()
        }
    }, [isRoot, externalOnCollapseAll])

    const { fields, append, remove } = useFieldArray<
        StandardFormSchema,
        FieldArrayPath<StandardFormSchema>,
        'reactId'
    >({
        control,
        name,
        keyName: 'reactId',
    })

    const watched = useWatch({ control, name }) as StandardChildFormSchema[]
    const initialized = useRef(false)

    useEffect(() => {
        if (isRoot && !initialized.current && fields.length === 0) {
            append(createStandard(depth))
            initialized.current = true
        }
    }, [isRoot, fields.length, append, depth])

    useEffect(() => {
        if (!watched) return

        watched.forEach((item, i) => {
            if (!item?.is_child) return

            const children = item.children || []
            const needed = item.children_count || 0

            if (needed === children.length) return

            const baseDepth = (item.depth || 0) + 1

            let nextChildren = children

            if (needed > children.length) {
                nextChildren = [
                    ...children,
                    ...Array.from({ length: needed - children.length }, () =>
                        createStandard(baseDepth),
                    ),
                ]
            } else {
                nextChildren = children.slice(0, needed)
            }

            if (nextChildren.length !== children.length) {
                setValue(`${name}.${i}.children`, nextChildren, {
                    shouldDirty: true,
                    shouldValidate: false,
                })
            }
        })
    }, [watched, name, setValue])

    const handleRemove = useCallback(
        (index: number) => {
            remove(index)

            if (isRoot) return

            const parentPath = name.split('.').slice(0, -1).join('.')
            const count = getValues(`${parentPath}.children_count` as any) ?? 0

            if (count)
                setValue(`${parentPath}.children_count` as any, count - 1, {
                    shouldValidate: true,
                    shouldDirty: true,
                })
        },
        [remove, isRoot, name, getValues, setValue],
    )

    const handleAdd = useCallback(() => {
        append(createStandard(depth))
    }, [append, depth])

    return (
        <div>
            {isRoot && !readOnly && (
                <>
                    <div className="sticky top-[68px] z-40 mb-2">
                        <Button
                            size="sm"
                            type="button"
                            disabled={readOnly}
                            onClick={handleAdd}
                        >
                            <HiPlus className="text-lg" />
                        </Button>
                    </div>

                    <div className="flex justify-end gap-2 mb-4">
                        <Button
                            size="sm"
                            type="button"
                            disabled={readOnly || fields.length === 0}
                            variant="default"
                            onClick={handleExpandAll}
                        >
                            ✓ Expand
                        </Button>

                        <Button
                            size="sm"
                            type="button"
                            disabled={readOnly || fields.length === 0}
                            variant="default"
                            onClick={handleCollapseAll}
                        >
                            ✕ Collapse
                        </Button>
                    </div>
                </>
            )}

            {fields.map((field, index) => {
                const itemPath = `${name}.${index}`
                const isExpanded = activeOpenItems.has(itemPath)

                return (
                    <div key={field.reactId} className="relative">
                        {!readOnly && (
                            <Button
                                size="xs"
                                shape="circle"
                                type="button"
                                className="absolute -right-2 -top-2 z-10 shadow-sm hover:scale-110 transition-transform"
                                onClick={() => handleRemove(index)}
                            >
                                <HiTrash size={12} />
                            </Button>
                        )}
                        <StandardCard
                            key={field.reactId}
                            index={index}
                            standard={field}
                            errors={errors}
                            readOnly={readOnly}
                            control={control}
                            watchedStandards={watched}
                            baseName={name}
                            depth={depth}
                            parentNumber={parentNumber}
                            isExpanded={isExpanded}
                            openItems={activeOpenItems}
                            onToggle={() => handleToggle(itemPath)}
                            onChildToggle={handleToggle}
                            onChildExpandAll={handleExpandAll}
                            onChildCollapseAll={handleCollapseAll}
                        />
                    </div>
                )
            })}
        </div>
    )
}

export default memo(StandardRecursiveSection)
