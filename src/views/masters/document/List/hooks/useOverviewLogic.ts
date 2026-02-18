import { useEffect, useState } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { Option } from '@/@types/common'
import { DocumentFormSchema } from '@/schemas/document.schema'
import { generateDocumentNo } from '@/utils/resolveFieldValue'
import { Category } from '@/@types/category'

type Props = {
    categoryList: Category[]
}

export const useOverviewLogic = ({ categoryList }: Props) => {
    const { control, setValue } = useFormContext<DocumentFormSchema>()

    const [
        documentMode,
        reviewFrequency,
        effectiveDate,
        notificationUnit,
        notificationValue,
    ] = useWatch({
        control,
        name: [
            'mode',
            'review_frequency',
            'effective_date',
            'notification_unit',
            'notification_value',
        ],
    })

    const [selectedCategory, setSelectedCategory] = useState<Option | null>(
        null,
    )
    const [selectedDepartments, setSelectedDepartments] = useState<Option[]>([])
    const [notificationUnitOptions, setNotificationUnitOptions] = useState<
        Option[]
    >([])
    const [nextReviewDate, setNextReviewDate] = useState<string | null>(null)
    const [reviewNotificationDate, setReviewNotificationDate] = useState<
        string | null
    >(null)

    /* ---------------- Review Frequency → Unit Options ---------------- */
    useEffect(() => {
        if (reviewFrequency === 'Yearly') {
            setNotificationUnitOptions([
                { value: 'Day', label: 'Day' },
                { value: 'Month', label: 'Month' },
            ])
        } else if (reviewFrequency) {
            setNotificationUnitOptions([{ value: 'Day', label: 'Day' }])
        } else {
            setNotificationUnitOptions([])
        }
    }, [reviewFrequency])

    /* ---------------- Next Review Date ---------------- */
    useEffect(() => {
        if (!effectiveDate || !reviewFrequency) {
            setNextReviewDate(null)
            return
        }

        const start = new Date(effectiveDate)
        let next = new Date(start)

        if (reviewFrequency === 'Weekly') {
            next.setDate(start.getDate() + 7)
        } else if (reviewFrequency === 'Monthly') {
            const m = start.getMonth() + 1
            const candidate = new Date(start)
            candidate.setMonth(m)
            next =
                candidate.getMonth() !== m % 12
                    ? new Date(start.getFullYear(), m + 1, 0)
                    : candidate
        } else if (reviewFrequency === 'Yearly') {
            const y = start.getFullYear() + 1
            const candidate = new Date(y, start.getMonth(), start.getDate())
            next =
                candidate.getMonth() !== start.getMonth()
                    ? new Date(y, start.getMonth() + 1, 0)
                    : candidate
        }

        setNextReviewDate(next.toDateString())
    }, [effectiveDate, reviewFrequency])

    /* ---------------- Notification Date ---------------- */
    useEffect(() => {
        if (!nextReviewDate || !notificationValue || !notificationUnit) {
            setReviewNotificationDate(null)
            return
        }

        const base = new Date(nextReviewDate)
        const notify = new Date(base)
        const val = Number(notificationValue)

        if (notificationUnit === 'Day') notify.setDate(base.getDate() - val)
        if (notificationUnit === 'Month') notify.setMonth(base.getMonth() - val)

        setReviewNotificationDate(notify.toDateString())
    }, [nextReviewDate, notificationValue, notificationUnit])

    /* ---------------- Handlers ---------------- */
    const handleCategoryChange = async (option: Option) => {
        setSelectedCategory(option)

        const number = await generateDocumentNo(
            option,
            selectedDepartments,
            categoryList,
        )

        setValue('number', number)
    }

    const handleDepartmentChange = async (options: Option[]) => {
        setSelectedDepartments(options || [])

        const number = await generateDocumentNo(
            selectedCategory,
            options || [],
            categoryList,
        )

        setValue('number', number)
    }

    return {
        documentMode,
        notificationUnitOptions,
        nextReviewDate,
        reviewNotificationDate,
        handleCategoryChange,
        handleDepartmentChange,
    }
}
