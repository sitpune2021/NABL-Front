/* eslint-disable @typescript-eslint/no-explicit-any */
import ListActionTools from '@/components/shared/ListActionTools'
import { useClauseDetail } from '@/views/masters/clauses/List/hooks/useDetail'
import useUserList from '@/views/masters/user/List/hooks/useList'
import { useEffect, useState } from 'react'
import { actionButtons } from './actionButtons'
import { apiGetLabTaskAssign, apiLabTaskAssign } from '@/services/LabService'

const DocumentList = () => {
    const { clause, isLoading: isClauseLoading } = useClauseDetail('1')
    const { userList, isLoading: isUserLoading } = useUserList()

    const [assignments, setAssignments] = useState<any>({})

    const makeKey = (clauseId: number, docId: number) =>
        `${Number(clauseId)}_${Number(docId)}`

    useEffect(() => {
        const loadAssignments = async () => {
            try {
                const res = await apiGetLabTaskAssign()
                if (res?.status) {
                    const mapped: any = {}

                    res.data.forEach((item: any) => {
                        const key = makeKey(item.clause_id, item.document_id)

                        mapped[key] = {
                            user_id: Number(item.user_id),
                            user: item.user,
                        }
                    })

                    setAssignments(mapped)
                }
            } catch (err) {
                console.error('Load assignment error:', err)
            }
        }

        loadAssignments()
    }, [])

    const handleAssignChange = (
        clauseId: number,
        docId: number,
        userId: string,
    ) => {
        const key = makeKey(clauseId, docId)

        setAssignments((prev: any) => ({
            ...prev,
            [key]: { user_id: Number(userId) },
        }))
    }

    const handleAssign = async (clauseId: number, doc: any) => {
        const key = makeKey(clauseId, doc.id)
        const userId = assignments[key]?.user_id

        if (!userId) {
            alert('Please select a user')
            return
        }

        const payload = {
            clause_id: clauseId,
            document_id: doc.id,
            user_id: userId,
        }

        try {
            const res = await apiLabTaskAssign(payload)

            if (res?.status) {
                setAssignments((prev: any) => ({
                    ...prev,
                    [key]: {
                        user_id: userId,
                        user: userList.find(
                            (u: any) => Number(u.id) === Number(userId),
                        ),
                    },
                }))

                alert('✅ Task Assigned Successfully')
            } else {
                alert('❌ Failed to assign task')
            }
        } catch (error) {
            console.error('Assign Error:', error)
        }
    }

    const renderClause = (clauseItem: any) => {
        return (
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
                <h3 style={{ marginBottom: 10 }}>{clauseItem.title}</h3>

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
                        const key = makeKey(clauseItem.id, doc.id)
                        const assignment = assignments[key]
                        const isAssigned = !!assignment?.user_id

                        return (
                            <div
                                key={doc.id}
                                style={{
                                    border: '1px solid #e5e7eb',
                                    borderRadius: 8,
                                    padding: 16,
                                    background: isAssigned
                                        ? '#ecfdf5'
                                        : '#fdfdfd',
                                    transition: '0.2s',
                                }}
                            >
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

                                <div style={{ fontSize: 12 }}>
                                    {isAssigned ? (
                                        <span style={{ color: 'green' }}>
                                            ✅ Assigned
                                        </span>
                                    ) : (
                                        <span style={{ color: 'red' }}>
                                            ❌ Not Assigned
                                        </span>
                                    )}
                                </div>

                                {isAssigned && (
                                    <div
                                        style={{
                                            fontSize: 12,
                                            color: '#2563eb',
                                        }}
                                    >
                                        👤 {assignment?.user?.name}
                                    </div>
                                )}

                                {/* 👤 Assign Section */}
                                <div
                                    style={{
                                        display: 'flex',
                                        gap: 8,
                                        alignItems: 'center',
                                    }}
                                >
                                    <select
                                        value={assignment?.user_id ?? ''}
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
                                        <option value="">Select User</option>

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
                                        disabled={!assignment?.user_id}
                                        style={{
                                            padding: '6px 12px',
                                            background: assignment?.user_id
                                                ? '#2563eb'
                                                : '#9ca3af',
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
                                        {isAssigned ? 'Reassign' : 'Assign'}
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {clauseItem.children?.length > 0 &&
                    clauseItem.children.map((child: any) =>
                        renderClause(child),
                    )}
            </div>
        )
    }

    if (isClauseLoading || isUserLoading) {
        return <div style={{ padding: 20 }}>Loading...</div>
    }

    return (
        <div style={{ padding: 24, background: '#f9fafb', minHeight: '100vh' }}>
            <h2 style={{ marginBottom: 16 }}>Assign Tasks</h2>

            <ListActionTools buttons={actionButtons} />

            {clause?.clauses?.map((item: any) => renderClause(item))}
        </div>
    )
}

export default DocumentList
