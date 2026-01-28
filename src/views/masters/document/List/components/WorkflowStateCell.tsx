import { useEffect, useState } from 'react'
import { Document } from '@/@types/document'
import { useSessionUser } from '@/store/authStore'

type Props = {
    document: Document
    onSave?: (documentVersionId: number, action: string) => void
}

const ACTIONS_BY_STEP: Record<string, string[]> = {
    prepared: ['pending', 'completed', 'sent_back', 'rejected'],
    reviewed: ['pending', 'completed', 'sent_back', 'rejected'],
    approved: ['pending', 'completed', 'sent_back', 'rejected'],
    issued: ['pending', 'completed', 'sent_back', 'rejected'],
    effective: ['pending', 'completed'],
}

const WorkflowStateCell = ({ document, onSave }: Props) => {
    const { is_super_admin } = useSessionUser((state) => state.user)

    const version = document.current_version
    const currentStep = version.workflow_state
    const lastLog = version.workflow_logs?.[version.workflow_logs.length - 1]
    const lastAction = lastLog?.step_status ?? 'pending'
    const allowedActions = ACTIONS_BY_STEP[currentStep] ?? []
    const isFinal = currentStep === 'effective' && lastAction === 'completed'

    const [isEditing, setIsEditing] = useState(false)
    const [action, setAction] = useState(lastAction)

    useEffect(() => {
        setAction(lastAction)
    }, [lastAction])

    const handleSave = () => {
        setIsEditing(false)
        if (action !== lastAction) {
            onSave?.(version.id, action)
        }
    }
    if (document.mode == 'upload') return <span>—</span>

    if (isEditing && !isFinal && is_super_admin) {
        return (
            <select
                autoFocus
                className="border rounded px-2 py-1 text-sm"
                value={action}
                onChange={(e) => setAction(e.target.value)}
                onBlur={handleSave}
            >
                {allowedActions.map((a) => (
                    <option key={a} value={a}>
                        {a}
                    </option>
                ))}
            </select>
        )
    }

    return (
        <span
            className={`font-medium ${
                isFinal ? 'text-gray-500' : 'cursor-pointer text-blue-600'
            }`}
            title={
                isFinal
                    ? 'Workflow completed'
                    : 'Double click to perform action'
            }
            onDoubleClick={() => {
                if (!isFinal) setIsEditing(true)
            }}
        >
            {lastAction}
        </span>
    )
}

export default WorkflowStateCell
