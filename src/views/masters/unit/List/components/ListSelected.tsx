import { useCallback, useState } from 'react'
import StickyFooter from '@/components/shared/StickyFooter'
import Button from '@/components/ui/Button'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { TbChecks } from 'react-icons/tb'
import useUnitList from '../hooks/useList'

const UnitListSelected = () => {
    const { selected, unitList, mutate, total, setAll } = useUnitList()

    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const handleDelete = useCallback(() => setIsDeleteOpen(true), [])
    const handleCancel = useCallback(() => setIsDeleteOpen(false), [])

    const handleConfirmDelete = useCallback(() => {
        if (!selected.length) return
        const remainingunits = unitList.filter(
            (unit) => !selected.some((sel) => sel.id === unit.id),
        )
        setAll([])
        mutate(
            {
                data: remainingunits,
                total: total - selected.length,
            },
            false,
        )
        setIsDeleteOpen(false)
    }, [unitList, selected, total, setAll, mutate])

    if (!selected.length) return null

    return (
        <>
            <StickyFooter
                className=" flex items-center justify-between py-4 bg-white dark:bg-gray-800"
                stickyClass="-mx-4 sm:-mx-8 border-t border-gray-200 dark:border-gray-700 px-8"
                defaultClass="container mx-auto px-8 rounded-xl border border-gray-200 dark:border-gray-600 mt-4"
            >
                <div className="container mx-auto">
                    <div className="flex items-center justify-between">
                        <span>
                            <span className="flex items-center gap-2">
                                <span className="text-lg text-primary">
                                    <TbChecks />
                                </span>
                                <span className="font-semibold flex items-center gap-1">
                                    <span className="heading-text">
                                        {selected.length > 1
                                            ? 'Units'
                                            : 'unit'}{' '}
                                    </span>
                                    <span>selected</span>
                                </span>
                            </span>
                        </span>

                        <div className="flex items-center">
                            <Button
                                size="sm"
                                className="ltr:mr-3 rtl:ml-3"
                                type="button"
                                customColorClass={() =>
                                    'border-error ring-1 ring-error text-error hover:border-error hover:ring-error hover:text-error'
                                }
                                onClick={handleDelete}
                            >
                                Delete
                            </Button>
                        </div>
                    </div>
                </div>
            </StickyFooter>
            <ConfirmDialog
                isOpen={isDeleteOpen}
                type="danger"
                title="Remove units"
                onClose={handleCancel}
                onRequestClose={handleCancel}
                onCancel={handleCancel}
                onConfirm={handleConfirmDelete}
            >
                <p>
                    {' '}
                    Are you sure you want to remove these units? This action
                    can&apos;t be undo.{' '}
                </p>
            </ConfirmDialog>
        </>
    )
}

export default UnitListSelected
