/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import { Document } from '@/@types/document'
import { useSessionUser } from '@/store/authStore'
import { Select } from '@/components/ui'

type Props = {
    document: Document
    onSave?: (documentVersionId: number, action: string) => void
    show?: boolean
}

const ACTIONS_BY_STEP: Record<string, string[]> = {
    prepared: ['pending', 'completed', 'sent_back', 'rejected'],
    reviewed: ['pending', 'completed', 'sent_back', 'rejected'],
    approved: ['pending', 'completed', 'sent_back', 'rejected'],
    issued: ['pending', 'completed', 'sent_back', 'rejected'],
    effective: ['pending', 'completed'],
}

const WorkflowStateCell = ({ document, onSave, show }: Props) => {
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

    const options = allowedActions.map((a) => ({
        value: a,
        label: a,
    }))

    const selectedOption = options.find((opt) => opt.value === action) || null

    if (isEditing && !isFinal && is_super_admin && !show) {
        return (
            <Select
                autoFocus
                size="sm"
                value={selectedOption}
                options={options}
                menuPortalTarget={window.document.body}
                menuPosition="fixed"
                styles={{
                    menuPortal: (base: any) => ({
                        ...base,
                        zIndex: 9999,
                    }),
                }}
                onChange={(option: any) => setAction(option?.value)}
                onBlur={handleSave}
            />
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
