/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useCallback, memo } from 'react'
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form'
import { HiPlus, HiTrash } from 'react-icons/hi'
import Button from '@/components/ui/Button'
import StandardCard from './StandardCard'
import { StandardChildFormSchema } from '@/schemas/standard.schema'

type StandardFieldPath =
    | 'clauses'
    | `clauses.${number}`
    | `clauses.${number}.children`

interface StandardRecursiveSectionProps {
    name: StandardFieldPath
    readOnly: boolean
    isRoot?: boolean
    depth?: number
}

const createDefaultStandard = (depth = 0) => ({
    id: Math.random(),
    title: '',
    message: '',
    note: true,
    is_child: false,
    children_count: 0,
    children: [],
    numbering_value: '',
    numbering_type: 'none',
    depth,
})

const StandardRecursiveSection = ({
    name,
    readOnly,
    isRoot = false,
    depth = 0,
}: StandardRecursiveSectionProps) => {
    const {
        control,
        setValue,
        getValues,
        formState: { errors },
    } = useFormContext<StandardChildFormSchema>()

    const { fields, append, update, remove } = useFieldArray({
        control,
        name,
        keyName: 'reactId',
    })

    const watched = useWatch({ control, name })
    const initialized = useRef(false)

    useEffect(() => {
        if (isRoot && !initialized.current && fields.length === 0) {
            append(createDefaultStandard(depth))
            initialized.current = true
        }
    }, [isRoot, fields.length, append, depth])

    useEffect(() => {
        watched?.forEach((item: any, i: number) => {
            if (!item?.is_child) return

            const children = item.children || []
            const needed = item.children_count || 0

            if (needed === children.length) return

            const baseDepth = (item.depth || 0) + 1

            const nextChildren =
                needed > children.length
                    ? [
                          ...children,
                          ...Array.from(
                              { length: needed - children.length },
                              () => createDefaultStandard(baseDepth),
                          ),
                      ]
                    : children.slice(0, needed)

            update(i, { ...item, children: nextChildren })
        })
    }, [watched, update])
    const handleRemove = useCallback(
        (index: number) => {
            remove(index)

            if (isRoot) return

            const parentPath = name.replace(/\.children$/, '')
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
        append(createDefaultStandard(depth))
    }, [append, depth])

    return (
        <div>
            {isRoot && !readOnly && (
                <Button
                    size="sm"
                    type="button"
                    disabled={readOnly}
                    className="sticky top-[68px] z-40 left-[1366px]"
                    onClick={handleAdd}
                >
                    <HiPlus className="text-lg" />
                </Button>
            )}

            {fields.map((field, index) => (
                <div key={field.reactId} className="relative pl-4">
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
                    />
                </div>
            ))}
        </div>
    )
}

export default memo(StandardRecursiveSection)
