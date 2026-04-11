/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo } from 'react'
import { TbSearch, TbFile, TbCheck } from 'react-icons/tb'
import { Checkbox, Button, Input } from '@/components/ui'

interface Doc {
    id: number
    name: string
}

interface DocumentSelectorProps {
    documentList: Doc[]
    value: any[]
    onChange: (ids: number[]) => void
    isDisabled?: boolean
}

const DocumentSelector = ({
    documentList = [],
    value = [],
    onChange,
    isDisabled = false,
}: DocumentSelectorProps) => {
    const [query, setQuery] = useState('')

    const safeDocs = useMemo(
        () => (Array.isArray(documentList) ? documentList : []),
        [documentList],
    )

    const safeValue = useMemo(
        () => (Array.isArray(value) ? value : []),
        [value],
    )

    const selectedSet = useMemo(() => new Set(safeValue), [safeValue])

    const filtered = useMemo(
        () =>
            safeDocs.filter((d) =>
                d.name.toLowerCase().includes(query.toLowerCase()),
            ),
        [safeDocs, query],
    )

    const isAllSelected =
        safeDocs.length > 0 && safeDocs.every((d) => selectedSet.has(d.id))

    const toggleDoc = (id: number) => {
        if (isDisabled) return
        const next = new Set(selectedSet)
        next.has(id) ? next.delete(id) : next.add(id)
        onChange([...next])
    }

    const toggleAll = () => {
        if (isDisabled) return
        if (isAllSelected) {
            onChange([])
        } else {
            onChange(safeDocs.map((d) => d.id))
        }
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <TbCheck className="text-base text-gray-400 dark:text-gray-500" />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {selectedSet.size}{' '}
                        <span className="font-normal text-gray-400 dark:text-gray-500">
                            / {safeDocs.length} selected
                        </span>
                    </span>
                </div>
                <Button
                    size="sm"
                    variant="default"
                    type="button"
                    disabled={isDisabled}
                    onClick={toggleAll}
                >
                    {isAllSelected ? 'Deselect All' : 'Select All'}
                </Button>
            </div>

            <Input
                prefix={<TbSearch className="text-lg" />}
                placeholder="Search documents..."
                value={query}
                disabled={isDisabled}
                onChange={(e) => setQuery(e.target.value)}
            />

            {query && filtered.length < safeDocs.length && (
                <p className="text-xs text-gray-400 dark:text-gray-500 -mt-2">
                    Showing {filtered.length} of {safeDocs.length} documents
                </p>
            )}

            <div className="rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                <div className="max-h-72 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800">
                    {filtered.length === 0 ? (
                        <div className="py-10 text-center text-sm text-gray-400 dark:text-gray-500">
                            No documents found
                        </div>
                    ) : (
                        filtered.map((doc) => {
                            const isChecked = selectedSet.has(doc.id)
                            return (
                                <div
                                    key={doc.id}
                                    className={`
                                        group flex items-center gap-3 px-4 py-3
                                        cursor-pointer select-none transition-all duration-150
                                        ${
                                            isChecked
                                                ? 'bg-primary-50 dark:bg-gray-700/60'
                                                : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/40'
                                        }
                                        ${isDisabled ? 'cursor-not-allowed opacity-60' : ''}
                                    `}
                                    onClick={() => toggleDoc(doc.id)}
                                >
                                    <Checkbox
                                        disabled={isDisabled}
                                        checked={isChecked}
                                        onChange={() => toggleDoc(doc.id)}
                                    />

                                    <div
                                        className={`
                                        flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0 transition-colors
                                        ${
                                            isChecked
                                                ? 'bg-primary-100 dark:bg-gray-600'
                                                : 'bg-gray-100 dark:bg-gray-700 group-hover:bg-gray-200 dark:group-hover:bg-gray-600'
                                        }
                                    `}
                                    >
                                        <TbFile
                                            className={`text-base ${isChecked ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 dark:text-gray-500'}`}
                                        />
                                    </div>

                                    <span
                                        className={`
                                        text-sm truncate flex-1
                                        ${
                                            isChecked
                                                ? 'font-medium text-gray-800 dark:text-gray-100'
                                                : 'text-gray-600 dark:text-gray-400'
                                        }
                                    `}
                                    >
                                        {doc.name}
                                    </span>

                                    {isChecked && (
                                        <TbCheck className="text-base text-primary-500 dark:text-primary-400 flex-shrink-0" />
                                    )}
                                </div>
                            )
                        })
                    )}
                </div>
            </div>
        </div>
    )
}

export default DocumentSelector
