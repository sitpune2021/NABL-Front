import { useEffect, useState } from 'react'
import { Document } from '@/@types/document'

type Props = {
    document: Document
    onSave?: (id: number, value: string) => void
}

const WORKFLOW_STEPS = ['draft', 'prepared', 'reviewed', 'approved', 'issued']

const WorkflowStateCell = ({ document, onSave }: Props) => {
    const [isEditing, setIsEditing] = useState(false)
    const [value, setValue] = useState(document.current_version.workflow_state)

    useEffect(() => {
        setValue(document.current_version.workflow_state)
    }, [document.current_version.workflow_state])

    const handleSave = () => {
        setIsEditing(false)
        if (value !== document.current_version.workflow_state) {
            onSave?.(document?.id, value)
        }
    }

    if (isEditing) {
        return (
            <select
                autoFocus
                className="border rounded px-2 py-1 text-sm"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onBlur={handleSave}
            >
                {WORKFLOW_STEPS.map((step) => (
                    <option key={step} value={step}>
                        {step}
                    </option>
                ))}
            </select>
        )
    }

    return (
        <span
            className="cursor-pointer font-medium text-blue-600"
            title="Double click to change"
            onDoubleClick={() => setIsEditing(true)}
        >
            {value}
        </span>
    )
}

export default WorkflowStateCell
