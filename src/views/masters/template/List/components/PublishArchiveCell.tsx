import { useEffect, useState } from 'react'
import { useSessionUser } from '@/store/authStore'

type Props = {
    status?: 'published' | 'archived' | 'draft'
    recordId: number | string
    onSave?: (id: number | string, status: 'published' | 'archived') => void
}

const ACTIONS = ['published', 'archived'] as const

const PublishArchiveCell = ({ status, recordId, onSave }: Props) => {
    const { is_super_admin } = useSessionUser((state) => state.user)

    const [isEditing, setIsEditing] = useState(false)
    const [value, setValue] = useState<'published' | 'archived' | undefined>(
        status === 'draft' ? undefined : status,
    )

    useEffect(() => {
        if (status !== 'draft') {
            setValue(status)
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

    if (isEditing && is_super_admin) {
        return (
            <select
                autoFocus
                className="border rounded px-2 py-1 text-sm"
                value={value}
                onChange={(e) =>
                    setValue(e.target.value as 'published' | 'archived')
                }
                onBlur={handleSave}
            >
                {ACTIONS.map((action) => (
                    <option key={action} value={action}>
                        {action}
                    </option>
                ))}
            </select>
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
