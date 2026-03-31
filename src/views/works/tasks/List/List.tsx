/* eslint-disable @typescript-eslint/no-explicit-any */
import ListActionTools from '@/components/shared/ListActionTools'
import { useClauseDetail } from '@/views/masters/clauses/List/hooks/useDetail'
import useUserList from '@/views/masters/user/List/hooks/useList'
import { useEffect, useState } from 'react'
import { actionButtons } from './actionButtons'
import { apiGetLabTaskAssign, apiLabTaskAssign } from '@/services/LabService'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import Tag from '@/components/ui/Tag'
import Spinner from '@/components/ui/Spinner'
import Dialog from '@/components/ui/Dialog'
import Avatar from '@/components/ui/Avatar'
import {
    TbUserCog,
    TbFileText,
    TbCircleCheck,
    TbCircleX,
    TbHash,
    TbClockHour4,
    TbLayersLinked,
    TbUserCheck,
    TbCheck,
    TbConfetti,
    TbArrowRight,
} from 'react-icons/tb'

const DocumentList = () => {
    const { clause, isLoading: isClauseLoading } = useClauseDetail('1')
    const { userList, isLoading: isUserLoading } = useUserList()

    const [assignments, setAssignments] = useState<any>({})
    const [successDialog, setSuccessDialog] = useState<{
        open: boolean
        userName: string
        docName: string
    }>({ open: false, userName: '', docName: '' })

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
            [key]: { ...prev[key], user_id: Number(userId) },
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
                const assignedUser = userList.find(
                    (u: any) => Number(u.id) === Number(userId),
                )
                setAssignments((prev: any) => ({
                    ...prev,
                    [key]: {
                        user_id: userId,
                        user: assignedUser,
                    },
                }))
                setSuccessDialog({
                    open: true,
                    userName:
                        assignedUser?.name || assignedUser?.email || 'User',
                    docName: doc.name,
                })
            } else {
                alert('❌ Failed to assign task')
            }
        } catch (error) {
            console.error('Assign Error:', error)
        }
    }

    const userOptions = userList?.map((user: any) => ({
        value: String(user.id),
        label: user.name || user.email,
    }))

    const renderClause = (clauseItem: any) => {
        return (
            <div key={clauseItem.id} className="mt-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/30">
                        <TbLayersLinked className="text-primary-600 dark:text-primary-400 text-lg" />
                    </div>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-100 text-base">
                        {clauseItem.title}
                    </h4>
                    <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700 ml-2" />
                    <Tag className="bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 border-0 text-xs font-medium">
                        {clauseItem.documents?.length ?? 0} Documents
                    </Tag>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {clauseItem.documents?.map((doc: any) => {
                        const key = makeKey(clauseItem.id, doc.id)
                        const assignment = assignments[key]
                        const isAssigned = !!assignment?.user_id

                        return (
                            <div
                                key={doc.id}
                                className="relative rounded-xl border border-gray-200 dark:border-gray-700 transition-all duration-200 hover:shadow-md bg-white dark:bg-gray-800 flex flex-col overflow-visible"
                            >
                                <div
                                    className="absolute top-0 left-0 w-1 h-full rounded-l-xl transition-colors duration-200"
                                    style={{
                                        background: isAssigned
                                            ? '#2a85ff'
                                            : '#e5e7eb',
                                    }}
                                />

                                <div className="p-4 pl-5 flex flex-col flex-1">
                                    <div className="flex items-start justify-between gap-2 mb-3">
                                        <div className="flex items-center gap-2 min-w-0">
                                            <TbFileText className="text-gray-400 dark:text-gray-500 shrink-0 text-base" />
                                            <span className="font-semibold text-gray-800 dark:text-gray-100 text-sm leading-tight line-clamp-2">
                                                {doc.name}
                                            </span>
                                        </div>
                                        <Tag className="shrink-0 text-xs border-0 font-medium whitespace-nowrap bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                                            {isAssigned ? (
                                                <span className="flex items-center gap-1">
                                                    <TbCircleCheck className="text-sm" />
                                                    Assigned
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1">
                                                    <TbCircleX className="text-sm" />
                                                    Unassigned
                                                </span>
                                            )}
                                        </Tag>
                                    </div>

                                    <div className="space-y-1.5 mb-3">
                                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                            <TbHash className="shrink-0" />
                                            <span className="truncate">
                                                {doc.number}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                            <TbClockHour4 className="shrink-0" />
                                            <span>
                                                v
                                                {
                                                    doc.current_version
                                                        ?.full_version
                                                }
                                                {doc.current_version?.schedule
                                                    ?.type && (
                                                    <span className="ml-1 text-gray-400">
                                                        ·{' '}
                                                        {
                                                            doc.current_version
                                                                .schedule.type
                                                        }
                                                    </span>
                                                )}
                                            </span>
                                        </div>
                                        {isAssigned &&
                                            assignment?.user?.name && (
                                                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                                    <TbUserCheck className="shrink-0" />
                                                    <span className="truncate">
                                                        {assignment.user.name}
                                                    </span>
                                                </div>
                                            )}
                                    </div>

                                    <div className="h-px bg-gray-100 dark:bg-gray-700 mb-3" />

                                    <div
                                        className="flex items-center gap-2"
                                        style={{
                                            position: 'relative',
                                            zIndex: 10,
                                        }}
                                    >
                                        <div className="flex-1 min-w-0">
                                            <Select
                                                size="sm"
                                                placeholder="Select user..."
                                                options={userOptions}
                                                value={
                                                    userOptions?.find(
                                                        (o: any) =>
                                                            Number(o.value) ===
                                                            Number(
                                                                assignment?.user_id,
                                                            ),
                                                    ) ?? null
                                                }
                                                onChange={(option: any) =>
                                                    handleAssignChange(
                                                        clauseItem.id,
                                                        doc.id,
                                                        option?.value ?? '',
                                                    )
                                                }
                                            />
                                        </div>
                                        <Button
                                            size="sm"
                                            variant="solid"
                                            disabled={!assignment?.user_id}
                                            icon={<TbUserCog />}
                                            onClick={() =>
                                                handleAssign(clauseItem.id, doc)
                                            }
                                        >
                                            Assign
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {clauseItem.children?.length > 0 && (
                    <div className="ml-6 border-l-2 border-dashed border-gray-200 dark:border-gray-700 pl-4 mt-4">
                        {clauseItem.children.map((child: any) =>
                            renderClause(child),
                        )}
                    </div>
                )}
            </div>
        )
    }

    if (isClauseLoading || isUserLoading) {
        return (
            <div className="flex items-center justify-center min-h-[300px] gap-3 text-gray-500 dark:text-gray-400">
                <Spinner size="lg" />
                <span className="font-medium">Loading tasks...</span>
            </div>
        )
    }

    return (
        <div className="p-6 min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Page Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                        Assign Tasks
                    </h2>
                </div>
                <ListActionTools buttons={actionButtons} />
            </div>

            {clause?.clauses?.map((item: any) => renderClause(item))}

            <Dialog
                isOpen={successDialog.open}
                width={420}
                onClose={() =>
                    setSuccessDialog({ ...successDialog, open: false })
                }
                onRequestClose={() =>
                    setSuccessDialog({ ...successDialog, open: false })
                }
            >
                <div className="relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-primary-500 to-primary-700 rounded-t-xl" />
                    <div className="absolute top-4 right-4 w-20 h-20 rounded-full bg-white/10" />
                    <div className="absolute top-8 right-12 w-10 h-10 rounded-full bg-white/10" />

                    <div className="relative pt-10 pb-6 px-6 flex flex-col items-center">
                        <div className="w-16 h-16 rounded-2xl bg-white shadow-lg flex items-center justify-center mb-4 rotate-3">
                            <TbConfetti className="text-primary-600 text-3xl" />
                        </div>

                        <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 mt-2">
                            Successfully Assigned!
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 text-center">
                            The document has been assigned to a team member.
                        </p>

                        <div className="w-full mt-5 bg-gray-50 dark:bg-gray-800 rounded-xl p-4 flex items-center gap-3">
                            <div className="flex-1 min-w-0 flex flex-col items-center gap-1.5 bg-white dark:bg-gray-700 rounded-lg p-3 shadow-sm">
                                <TbFileText className="text-primary-500 text-xl" />
                                <span className="text-xs font-medium text-gray-700 dark:text-gray-200 text-center line-clamp-2 leading-tight">
                                    {successDialog.docName}
                                </span>
                            </div>
                            <div className="shrink-0">
                                <div className="w-7 h-7 rounded-full bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center">
                                    <TbArrowRight className="text-primary-600 dark:text-primary-400 text-sm" />
                                </div>
                            </div>
                            <div className="flex-1 min-w-0 flex flex-col items-center gap-1.5 bg-white dark:bg-gray-700 rounded-lg p-3 shadow-sm">
                                <Avatar
                                    size={28}
                                    shape="circle"
                                    className="bg-primary-500 text-white"
                                >
                                    {successDialog.userName
                                        ?.charAt(0)
                                        ?.toUpperCase()}
                                </Avatar>
                                <span className="text-xs font-medium text-gray-700 dark:text-gray-200 text-center line-clamp-2 leading-tight">
                                    {successDialog.userName}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-1.5 mt-4 px-3 py-1.5 rounded-full bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                            <TbCheck className="text-green-600 dark:text-green-400 text-sm" />
                            <span className="text-xs font-semibold text-green-700 dark:text-green-400">
                                Task is now active
                            </span>
                        </div>

                        <Button
                            className="mt-5 w-full"
                            variant="solid"
                            onClick={() =>
                                setSuccessDialog({
                                    ...successDialog,
                                    open: false,
                                })
                            }
                        >
                            Done
                        </Button>
                    </div>
                </div>
            </Dialog>
        </div>
    )
}

export default DocumentList
