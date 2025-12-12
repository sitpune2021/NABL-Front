/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useCallback, memo } from 'react'
import { useFieldArray, useWatch, Control, FieldErrors } from 'react-hook-form'
import { HiPlus } from 'react-icons/hi'
import Button from '@/components/ui/Button'
import StandardCard from './StandardCard'
import type { FormValues } from './StandardForm'

type StandardFieldPath =
    | 'standards'
    | `standards.${number}`
    | `standards.${number}.children`

interface StandardRecursiveSectionProps {
    control: Control<FormValues>
    name: StandardFieldPath
    errors: FieldErrors<FormValues>
    readOnly: boolean
    isRoot?: boolean
    depth?: number
}

const createDefaultStandard = (depth = 0) => ({
    id: Math.random(),
    title: '',
    message: '',
    note: true,
    isChild: false,
    count: 0,
    children: [],
    numberingValue: '',
    numberingType: 'none',
    depth,
})

const StandardRecursiveSection = ({
    control,
    name,
    errors,
    readOnly,
    isRoot = false,
    depth = 0,
}: StandardRecursiveSectionProps) => {
    const { fields, append, update } = useFieldArray({
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
            if (!item?.isChild) return

            const children = item.children || []
            const needed = item.count || 0

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

    const handleAdd = useCallback(() => {
        append(createDefaultStandard(depth))
    }, [append, depth])

    return (
        <div>
            {isRoot && (
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
            ))}
        </div>
    )
}

export default memo(StandardRecursiveSection)
