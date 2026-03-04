/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import { useSessionUser } from '@/store/authStore'
import { Select } from '@/components/ui'

type StatusType = 'published' | 'archived'

type Props = {
    status?: StatusType | 'draft'
    recordId: number | string
    onSave?: (id: number | string, status: StatusType) => void
}

const ACTIONS: StatusType[] = ['published', 'archived']

const PublishArchiveCell = ({ status, recordId, onSave }: Props) => {
    const { is_super_admin } = useSessionUser((state) => state.user)

    const [isEditing, setIsEditing] = useState(false)
    const [value, setValue] = useState<StatusType | null>(
        status === 'draft' ? null : (status as StatusType),
    )

    useEffect(() => {
        if (status && status !== 'draft') {
            setValue(status as StatusType)
        }
    }, [status])

    if (!status || status === 'draft') {
        return <span className="text-gray-400">{status}</span>
    }

    const handleSave = () => {
        setIsEditing(false)
        if (value && value !== status) {
            onSave?.(recordId, value)
        }
    }
    const options = ACTIONS.map((action) => ({
        value: action,
        label: action,
    }))

    const selectedOption = options.find((opt) => opt.value === value) || null

    if (isEditing && is_super_admin) {
        return (
            <Select
                autoFocus
                size="sm"
                value={selectedOption}
                options={options}
                menuPortalTarget={document.body}
                menuPosition="fixed"
                styles={{
                    menuPortal: (base: any) => ({ ...base, zIndex: 9999 }),
                }}
                onChange={(option: any) =>
                    setValue(option?.value as StatusType)
                }
                onBlur={handleSave}
            />
        )
    }

    return (
        <span
            className={`font-medium cursor-pointer ${
                value === 'archived' ? 'text-gray-500' : 'text-green-600'
            }`}
            onDoubleClick={() => setIsEditing(true)}
        >
            {value}
        </span>
    )
}

export default PublishArchiveCell
