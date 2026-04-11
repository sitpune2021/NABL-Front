/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useCallback, memo } from 'react'
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

const StandardRecursiveSection = ({
    name,
    readOnly,
    isRoot = false,
    depth = 0,
    parentNumber = '', // ✅ ADD THIS
}: StandardRecursiveSectionProps) => {
    const {
        control,
        setValue,
        getValues,
        formState: { errors },
    } = useFormContext<StandardFormSchema>()

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
                <Button
                    size="sm"
                    type="button"
                    disabled={readOnly}
                    className="sticky top-[68px] z-40"
                    onClick={handleAdd}
                >
                    <HiPlus className="text-lg" />
                </Button>
            )}

            {fields.map((field, index) => (
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
                        parentNumber={parentNumber} // ✅ FIXED
                    />
                </div>
            ))}
        </div>
    )
}

export default memo(StandardRecursiveSection)
