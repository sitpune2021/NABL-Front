/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from 'react'
import { useFieldArray, useWatch } from 'react-hook-form'
import { HiPlus } from 'react-icons/hi'
import Button from '@/components/ui/Button'
import StandardCard from './StandardCard'

interface StandardRecursiveSectionProps {
    control: any
    name: string
    errors: any
    readOnly: boolean
    isRoot?: boolean
}

const createDefaultStandard = () => ({
    id: Date.now() + Math.random(), // unique
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
    const { fields, append, update } = useFieldArray({ control, name })
    const watchedStandards = useWatch({ control, name, defaultValue: [] })
    const hasAppended = useRef(false)

    // Append default standard at root if empty
    useEffect(() => {
        if (isRoot && !hasAppended.current && fields.length === 0) {
            append(createDefaultStandard())
            hasAppended.current = true
        }
    }, [isRoot])

    // Watch isChild & count to sync children
    useEffect(() => {
        watchedStandards?.forEach((standard: any, index: number) => {
            if (!standard || !standard.isChild) return

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
        })
    }, [watchedStandards, update])

    // Handlers
    const handleAddSection = () => append(createDefaultStandard())

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
                    key={field.id}
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
