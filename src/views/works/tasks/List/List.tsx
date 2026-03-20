/* eslint-disable @typescript-eslint/no-explicit-any */
import ListActionTools from '@/components/shared/ListActionTools'
import { useClauseDetail } from '@/views/masters/clauses/List/hooks/useDetail'
import useUserList from '@/views/masters/user/List/hooks/useList'
import React from 'react'
import { actionButtons } from './actionButtons'

const DocumentList = () => {
    const { clause, isLoading: isClauseLoading } = useClauseDetail('1')
    const { userList, isLoading: isUserLoading } = useUserList()

    const [assignments, setAssignments] = React.useState<any>({})

    if (isClauseLoading || isUserLoading) {
        return <div style={{ padding: 20 }}>Loading...</div>
    }

    const handleAssignChange = (
        clauseId: number,
        docId: number,
        userId: string,
    ) => {
        const key = `${clauseId}_${docId}`

        setAssignments((prev: any) => ({
            ...prev,
            [key]: userId,
        }))
    }

    const handleAssign = (clauseId: number, doc: any) => {
        const key = `${clauseId}_${doc.id}`
        const userId = assignments[key]

        if (!userId) {
            alert('Please select a user')
            return
        }

        const payload = {
            clause_id: clauseId,
            document_id: doc.id,
            user_id: userId,
        }

        console.log('Assign API Payload:', payload)
    }

    return (
        <div style={{ padding: 24, background: '#f9fafb', minHeight: '100vh' }}>
            <h2 style={{ marginBottom: 16 }}>Assign Tasks</h2>

            <ListActionTools buttons={actionButtons} />

            {clause?.clauses?.map((clauseItem: any) => (
                <div
                    key={clauseItem.id}
                    style={{
                        background: '#fff',
                        padding: 20,
                        marginTop: 20,
                        borderRadius: 10,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                    }}
                >
                    {/* Clause Title */}
                    <h3 style={{ marginBottom: 10, color: '#111827' }}>
                        {clauseItem.title}
                    </h3>

                    {/* Documents Grid */}
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns:
                                'repeat(auto-fill, minmax(300px, 1fr))',
                            gap: 16,
                            marginTop: 10,
                        }}
                    >
                        {clauseItem.documents?.map((doc: any) => {
                            const key = `${clauseItem.id}_${doc.id}`

                            return (
                                <div
                                    key={doc.id}
                                    style={{
                                        border: '1px solid #e5e7eb',
                                        borderRadius: 8,
                                        padding: 16,
                                        background: '#fdfdfd',
                                        transition: '0.2s',
                                    }}
                                >
                                    {/* 📄 Document Info */}
                                    <div style={{ marginBottom: 8 }}>
                                        <strong style={{ fontSize: 15 }}>
                                            {doc.name}
                                        </strong>
                                        <div
                                            style={{
                                                fontSize: 12,
                                                color: '#6b7280',
                                            }}
                                        >
                                            {doc.number}
                                        </div>
                                    </div>

                                    <div
                                        style={{
                                            fontSize: 13,
                                            marginBottom: 6,
                                        }}
                                    >
                                        <span style={{ color: '#6b7280' }}>
                                            Status:
                                        </span>{' '}
                                        <span style={{ fontWeight: 500 }}>
                                            {doc.status}
                                        </span>
                                    </div>

                                    <div
                                        style={{
                                            fontSize: 13,
                                            marginBottom: 6,
                                        }}
                                    >
                                        <span style={{ color: '#6b7280' }}>
                                            Version:
                                        </span>{' '}
                                        {doc.current_version?.full_version}
                                    </div>

                                    <div
                                        style={{
                                            fontSize: 13,
                                            marginBottom: 10,
                                        }}
                                    >
                                        <span style={{ color: '#6b7280' }}>
                                            Schedule:
                                        </span>{' '}
                                        {doc.current_version?.schedule?.type}
                                    </div>

                                    {/* 👤 Assign Section */}
                                    <div
                                        style={{
                                            display: 'flex',
                                            gap: 8,
                                            alignItems: 'center',
                                        }}
                                    >
                                        <select
                                            value={assignments[key] || ''}
                                            style={{
                                                flex: 1,
                                                padding: '6px 8px',
                                                borderRadius: 6,
                                                border: '1px solid #d1d5db',
                                                fontSize: 13,
                                            }}
                                            onChange={(e) =>
                                                handleAssignChange(
                                                    clauseItem.id,
                                                    doc.id,
                                                    e.target.value,
                                                )
                                            }
                                        >
                                            <option value="">
                                                Select User
                                            </option>

                                            {userList?.map((user: any) => (
                                                <option
                                                    key={user.id}
                                                    value={user.id}
                                                >
                                                    {user.name || user.email}
                                                </option>
                                            ))}
                                        </select>

                                        <button
                                            style={{
                                                padding: '6px 12px',
                                                background: '#2563eb',
                                                color: '#fff',
                                                border: 'none',
                                                borderRadius: 6,
                                                cursor: 'pointer',
                                                fontSize: 13,
                                            }}
                                            onClick={() =>
                                                handleAssign(clauseItem.id, doc)
                                            }
                                        >
                                            Assign
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default DocumentList
