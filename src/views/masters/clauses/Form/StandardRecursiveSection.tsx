/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useCallback } from 'react'
import { useFieldArray, useWatch, Control, FieldErrors } from 'react-hook-form'
import { HiPlus } from 'react-icons/hi'
import Button from '@/components/ui/Button'
import StandardCard from './StandardCard'
import type { FormValues } from './StandardForm'

// Type-safe paths for useFieldArray
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
    depth,
})

const StandardRecursiveSection = ({
    control,
    name = 'standards' as StandardFieldPath,
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

    const watchedStandards = useWatch({ control, name, defaultValue: [] })
    const hasAppended = useRef(false)

    // Add default root standard if empty
    useEffect(() => {
        if (isRoot && !hasAppended.current && fields.length === 0) {
            append(createDefaultStandard(depth))
            hasAppended.current = true
        }
    }, [isRoot, fields.length, append, depth])

    // Update children automatically based on count
    useEffect(() => {
        watchedStandards?.forEach((standard: any, index: number) => {
            if (!standard?.isChild) return

            const currentChildren = standard.children || []
            const targetCount = standard.count || 0

            if (targetCount > currentChildren.length) {
                const extra = Array.from(
                    { length: targetCount - currentChildren.length },
                    () => createDefaultStandard((standard.depth || 0) + 1),
                )
                update(index, {
                    ...standard,
                    children: [...currentChildren, ...extra],
                })
            } else if (targetCount < currentChildren.length) {
                update(index, {
                    ...standard,
                    children: currentChildren.slice(0, targetCount),
                })
            }
        })
    }, [watchedStandards, update])

    const handleAddSection = useCallback(() => {
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
                    onClick={handleAddSection}
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
                    watchedStandards={watchedStandards}
                    baseName={name}
                    depth={depth}
                />
            ))}
        </div>
    )
}

export default StandardRecursiveSection
