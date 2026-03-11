import { useState, useCallback, useMemo, useEffect } from 'react'
import Drawer from '@/components/ui/Drawer'
import Button from '@/components/ui/Button'
import Checkbox from '@/components/ui/Checkbox'
import { HiOutlineInbox, HiCheckCircle } from 'react-icons/hi'
import {
    apiApproveInstrument,
    apiGetPendingInstrument,
} from '@/services/InstrumentService'
import { Instrument, GetInstrumentListResponse } from '@/@types/instrument'
import { useInstrumentList } from '../hooks/useList'

const InstrumentPendingDrawer = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [instruments, setInstruments] = useState<Instrument[]>([])
    const [selectedIds, setSelectedIds] = useState<number[]>([])
    const [pendingCount, setPendingCount] = useState(0)

    const { mutate } = useInstrumentList()

    const fetchInstruments = useCallback(async () => {
        try {
            setLoading(true)

            const res =
                (await apiGetPendingInstrument()) as GetInstrumentListResponse
            const data = res?.data ?? []

            setInstruments(data)
            setPendingCount(data.length)
        } finally {
            setLoading(false)
        }
    }, [])
    useEffect(() => {
        fetchInstruments()
    }, [fetchInstruments])

    useEffect(() => {
        if (isOpen) {
            fetchInstruments()
        }
    }, [isOpen, fetchInstruments])

    const handleOpen = useCallback(() => {
        setIsOpen(true)
    }, [])

    const handleClose = useCallback(() => {
        setIsOpen(false)
        setSelectedIds([])
    }, [])

    const toggleSelection = useCallback((id: number) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
        )
    }, [])

    const handleApprove = useCallback(async () => {
        if (!selectedIds.length) return

        try {
            setLoading(true)
            await apiApproveInstrument(selectedIds)
            mutate()
            await fetchInstruments()
            setSelectedIds([])
            setIsOpen(false)
        } finally {
            setLoading(false)
        }
    }, [selectedIds, mutate, fetchInstruments])

    const allIds = useMemo(
        () => instruments.map((c) => Number(c.id)),
        [instruments],
    )

    const isAllSelected =
        instruments.length > 0 && selectedIds.length === instruments.length

    const isIndeterminate = selectedIds.length > 0 && !isAllSelected

    const handleSelectAll = useCallback(() => {
        setSelectedIds(isAllSelected ? [] : allIds)
    }, [isAllSelected, allIds])
    console.log(instruments)

    return (
        <>
            <Button
                variant="default"
                icon={<HiCheckCircle />}
                onClick={handleOpen}
            >
                Pending Approvals ({pendingCount})
            </Button>

            <Drawer
                title={
                    <span className="font-semibold text-gray-900 text-lg">
                        Pending Instruments
                    </span>
                }
                isOpen={isOpen}
                width={480}
                footer={
                    <div className="flex gap-3 w-full pt-4  border-gray-100">
                        <Button
                            block
                            variant="default"
                            disabled={loading}
                            onClick={handleClose}
                        >
                            Cancel
                        </Button>

                        <Button
                            block
                            variant="solid"
                            color="blue-600"
                            loading={loading}
                            disabled={!selectedIds.length}
                            onClick={handleApprove}
                        >
                            Approve
                        </Button>
                    </div>
                }
                onClose={handleClose}
            >
                {loading && !instruments.length && (
                    <div className="flex flex-col items-center justify-center py-20 gap-3">
                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent" />
                        <p className="text-gray-500 text-sm">
                            Fetching pending instruments...
                        </p>
                    </div>
                )}

                {!loading && instruments.length > 0 && (
                    <>
                        <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-100  top-0 z-10">
                            <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                                {selectedIds.length} of {instruments.length}{' '}
                                Selected
                            </span>
                            <Checkbox
                                checked={isAllSelected}
                                indeterminate={isIndeterminate}
                                onChange={handleSelectAll}
                            />
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {instruments.map((instrument) => {
                                const id = Number(instrument.id)
                                const isSelected = selectedIds.includes(id)

                                return (
                                    <div
                                        key={id}
                                        className={`
                                            group flex items-center p-4 rounded-xl border cursor-pointer transition-all duration-200
                                            ${
                                                isSelected
                                                    ? 'bg-white border-blue-200 shadow-md ring-1 ring-blue-500'
                                                    : 'bg-white border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300'
                                            }
                                        `}
                                        onClick={() => toggleSelection(id)}
                                    >
                                        <Checkbox
                                            checked={isSelected}
                                            className="pointer-events-none"
                                            onChange={() => {}}
                                        />

                                        <div className="ml-4 flex-1">
                                            <p
                                                className={`font-medium text-sm transition-colors ${
                                                    isSelected
                                                        ? 'text-blue-500'
                                                        : 'text-gray-800'
                                                }`}
                                            >
                                                {instrument.name}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-0.5">
                                                {instrument.lab?.name ??
                                                    'Unknown Lab'}
                                            </p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </>
                )}

                {!loading && !instruments.length && (
                    <div className="flex flex-col items-center justify-center py-24 text-center px-6">
                        <div className="bg-gray-50 p-4 rounded-full mb-4">
                            <HiOutlineInbox className="text-3xl text-gray-400" />
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900">
                            No Pending Instruments
                        </h4>
                        <p className="text-gray-500 text-sm mt-1">
                            All instruments are already approved.
                        </p>
                    </div>
                )}
            </Drawer>
        </>
    )
}

export default InstrumentPendingDrawer
