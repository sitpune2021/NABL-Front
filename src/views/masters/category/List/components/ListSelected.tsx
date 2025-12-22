import { useState, useCallback } from 'react'
import StickyFooter from '@/components/shared/StickyFooter'
import Button from '@/components/ui/Button'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { TbChecks } from 'react-icons/tb'
import { useCategoryList } from '../hooks/useList'

const CategoryListSelected = () => {
    const { selected, categoryList, mutate, total, setAll } = useCategoryList()

    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const handleDelete = useCallback(() => setIsDeleteOpen(true), [])
    const handleCancel = useCallback(() => setIsDeleteOpen(false), [])

    const handleConfirmDelete = useCallback(() => {
        if (!selected.length) return
        const remainingCategories = categoryList.filter(
            (category) => !selected.some((sel) => sel.id === category.id),
        )
        setAll([])
        mutate(
            {
                data: remainingCategories,
                total: total - selected.length,
            },
            false,
        )
        setIsDeleteOpen(false)
    }, [categoryList, selected, total, setAll, mutate])

    if (!selected.length) return null

    return (
        <>
            <StickyFooter
                className="flex items-center justify-between py-4 bg-white dark:bg-gray-800"
                stickyClass="-mx-4 sm:-mx-8 border-t border-gray-200 dark:border-gray-700 px-8"
                defaultClass="container mx-auto px-8 rounded-xl border border-gray-200 dark:border-gray-600 mt-4"
            >
                <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-lg font-semibold text-primary">
                        <TbChecks />
                        {selected.length}{' '}
                        {selected.length > 1 ? 'Categories' : 'Category'}{' '}
                        selected
                    </span>

                    <Button
                        size="sm"
                        type="button"
                        customColorClass={() =>
                            'border-error ring-1 ring-error text-error hover:border-error hover:ring-error hover:text-error'
                        }
                        onClick={handleDelete}
                    >
                        Delete
                    </Button>
                </div>
            </StickyFooter>

            <ConfirmDialog
                isOpen={isDeleteOpen}
                type="danger"
                title="Remove categories"
                onClose={handleCancel}
                onRequestClose={handleCancel}
                onCancel={handleCancel}
                onConfirm={handleConfirmDelete}
            >
                <p>
                    Are you sure you want to remove these categories? This
                    action cannot be undone.
                </p>
            </ConfirmDialog>
        </>
    )
}

export default CategoryListSelected
