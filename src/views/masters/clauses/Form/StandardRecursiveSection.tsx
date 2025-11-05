/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useCallback } from 'react'
import { useFieldArray, useWatch, Control, FieldErrors } from 'react-hook-form'
import { HiPlus } from 'react-icons/hi'
import Button from '@/components/ui/Button'
import StandardCard from './StandardCard'
import type { FormValues } from './StandardForm'

interface StandardRecursiveSectionProps {
    control: Control<FormValues>
    name: string | any
    errors: FieldErrors<FormValues>
    readOnly: boolean
    isRoot?: boolean
}

const createDefaultStandard = () => ({
    id: Math.random(), // safer unique id
    title: '',
    message: '',
    note: true,
    isChild: false,
    count: 0,
    children: [],
})

const StandardRecursiveSection = ({
    control,
    name,
    errors,
    readOnly,
    isRoot = false,
}: StandardRecursiveSectionProps) => {
    const { fields, append, update } = useFieldArray({
        control,
        name,
        keyName: 'reactId', // prevent id conflicts
    })

    const watchedStandards = useWatch({ control, name, defaultValue: [] })
    const hasAppended = useRef(false)

    useEffect(() => {
        if (isRoot && !hasAppended.current && fields.length === 0) {
            append(createDefaultStandard())
            hasAppended.current = true
        }
    }, [isRoot])

    useEffect(() => {
        watchedStandards?.forEach(
            (
                standard: { isChild: any; children: never[]; count: number },
                index: number,
            ) => {
                if (!standard?.isChild) return

                const currentChildren = standard.children || []
                const targetCount = standard.count || 0

                if (targetCount > currentChildren.length) {
                    const extra = Array.from(
                        { length: targetCount - currentChildren.length },
                        () => createDefaultStandard(),
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
            },
        )
    }, [watchedStandards, update])

    const handleAddSection = useCallback(() => {
        append(createDefaultStandard())
    }, [append])

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
                    depth={isRoot ? 0 : 1}
                />
            ))}
        </div>
    )
}

export default StandardRecursiveSection
