import { useState, useCallback } from 'react'
import StickyFooter from '@/components/shared/StickyFooter'
import Button from '@/components/ui/Button'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { TbChecks } from 'react-icons/tb'
import { usePrefixConfigList } from '../hooks/useList'

const PrefixConfigListSelected = () => {
    const { selected, prefixConfigList, mutate, total, setAll } =
        usePrefixConfigList()

    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const handleDelete = useCallback(() => setIsDeleteOpen(true), [])
    const handleCancel = useCallback(() => setIsDeleteOpen(false), [])

    const handleConfirmDelete = useCallback(() => {
        if (!selected.length) return
        const remainingConfigs = prefixConfigList.filter(
            (prefixConfig) =>
                !selected.some((sel) => sel.id === prefixConfig.id),
        )
        setAll([])
        mutate(
            {
                data: remainingConfigs,
                total: total - selected.length,
            },
            false,
        )
        setIsDeleteOpen(false)
    }, [prefixConfigList, selected, total, setAll, mutate])

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
                        {selected.length > 1
                            ? 'Prefix configs'
                            : 'Prefix config'}{' '}
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
                title="Remove prefix configs"
                onClose={handleCancel}
                onRequestClose={handleCancel}
                onCancel={handleCancel}
                onConfirm={handleConfirmDelete}
            >
                <p>
                    Are you sure you want to remove these prefix configs? This
                    action cannot be undone.
                </p>
            </ConfirmDialog>
        </>
    )
}

export default PrefixConfigListSelected
