/* eslint-disable @typescript-eslint/no-explicit-any */
import { useClauseDetail } from '@/views/masters/clauses/List/hooks/useDetail'
import useLocationList from '@/views/masters/location/List/hooks/useList'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import Tag from '@/components/ui/Tag'
import Spinner from '@/components/ui/Spinner'
import Dialog from '@/components/ui/Dialog'
import Avatar from '@/components/ui/Avatar'
import {
    TbUserCog,
    TbFileText,
    TbHash,
    TbClockHour4,
    TbLayersLinked,
    TbCheck,
    TbConfetti,
    TbArrowRight,
} from 'react-icons/tb'
import { useEffect, useState } from 'react'
import { apiLabTaskAssign } from '@/services/LabService'
import { useAssignmentList } from './hooks/useAssignmentList'
import { useSessionUser } from '@/store/authStore'

const DocumentList = () => {
    const activeLab = useSessionUser((state) => state.activeLab)
    const { clause, isLoading } = useClauseDetail(activeLab?.standard_id)
    const { locationList } = useLocationList()
    const { assignment } = useAssignmentList()

    const [selection, setSelection] = useState<any>({})
    const [successDialog, setSuccessDialog] = useState({
        open: false,
        userName: '',
        docName: '',
    })

    useEffect(() => {
        if (!assignment?.length) return

        const mapped: any = {}

        assignment.forEach((item: any) => {
            const key = `${item.clause_id}_${item.document_id}`

            // 🔥 IMPORTANT LOGIC
            mapped[key] = {
                location: item.location_id ? String(item.location_id) : null,

                department: item.department_id
                    ? String(item.department_id)
                    : null,

                user: item.user_id ? item.user_id : null,
            }
        })

        setSelection(mapped)
    }, [assignment])

    const makeKey = (c: number, d: number) => `${c}_${d}`

    // ✅ selection handler
    const handleSelectionChange = (
        clauseId: number,
        docId: number,
        field: 'location' | 'department' | 'user',
        value: string,
    ) => {
        const key = makeKey(clauseId, docId)

        setSelection((prev: any) => {
            const current = prev[key] || {}

            let updated = { ...current, [field]: value }

            if (field === 'location') {
                updated = {
                    location: value,
                    department: null,
                    user: null,
                }
            }

            if (field === 'department') {
                updated = {
                    ...current,
                    location: current.location,
                    department: value,
                    user: null,
                }
            }

            console.log(updated)

            return {
                ...prev,
                [key]: updated,
            }
        })
    }

    // ✅ get location
    const getLocation = (key: string) => {
        const locId = selection[key]?.location
        return locationList?.find((l: any) => String(l.id) === locId)
    }

    // ✅ department options
    const getDepartmentOptions = (key: string) => {
        const location = getLocation(key) as any

        return (
            location?.departments?.map((d: any) => ({
                value: String(d.department.id),
                label: d.department.name,
            })) || []
        )
    }

    // ✅ user options (with real name)
    const getUserOptions = (key: string) => {
        const sel = selection[key]
        const location = getLocation(key) as any

        if (!location) return []

        let users: any[] = []

        if (sel?.department) {
            const dept = location.departments.find(
                (d: any) => String(d.department.id) === sel.department,
            )
            users = dept?.department?.users || []
        } else {
            users = location.departments.flatMap(
                (d: any) => d.department.users || [],
            )
        }

        return users.map((u: any) => ({
            value: u.user?.id,
            label: u.user?.name || u.user?.email,
        }))
    }

    // // ✅ FINAL USERS
    // const getFinalUsers = (key: string) => {
    //     const sel = selection[key]
    //     const location = getLocation(key) as any

    //     if (!location) return []

    //     // ✅ 1. SINGLE USER
    //     if (sel?.user) {
    //         return [{ user_id: Number(sel.user) }]
    //     }

    //     // ✅ 2. DEPARTMENT USERS
    //     if (sel?.department) {
    //         const dept = location.departments.find(
    //             (d: any) => String(d.department.id) === sel.department,
    //         )

    //         return (dept?.department?.users || [])
    //             .map((u: any) => ({
    //                 user_id: u.user?.id, // ✅ CORRECT FIELD
    //             }))
    //             .filter((u: any) => u.user_id != null)
    //     }

    //     // ✅ 3. LOCATION USERS
    //     const allUsers = location.departments.flatMap(
    //         (d: any) => d.department.users || [],
    //     )

    //     const uniqueUsers = Array.from(
    //         new Map(allUsers.map((u: any) => [u.user?.id, u])).values(),
    //     )

    //     return uniqueUsers
    //         .map((u: any) => ({
    //             user_id: u.user?.id, // ✅ CORRECT FIELD
    //         }))
    //         .filter((u: any) => u.user_id != null)
    // }

    // ✅ assign

    const handleAssign = async (clauseId: number, doc: any) => {
        const key = makeKey(clauseId, doc.id)
        const blocks = selection[key] || []

        const payload = {
            clause_id: clauseId,
            document_id: doc.id,
            locations: blocks.map((block: any) => ({
                id: Number(block.location),

                departments: (block.departments || []).map((dept: any) => ({
                    id: Number(dept.id),

                    users: (dept.users || []).map((u: any) => ({
                        id: Number(u),
                    })),
                })),
            })),
        }

        console.log('🔥 NEW PAYLOAD:', payload)

        try {
            await apiLabTaskAssign(payload)
        } catch (e) {
            console.error(e)
        }
    }

    const locationOptions = locationList?.map((l: any) => ({
        value: String(l.id),
        label: l.name,
    }))

    const renderClause = (c: any) => (
        <div key={c.id} className="mt-6">
            <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/30">
                    <TbLayersLinked className="text-primary-600 dark:text-primary-400 text-lg" />
                </div>
                <h4 className="font-semibold text-gray-800 dark:text-gray-100 text-base">
                    {c.numbering_value} - {c.title}
                </h4>
                <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700 ml-2" />
                <Tag className="bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 border-0 text-xs font-medium">
                    {c.document_links?.length ?? 0} Documents
                </Tag>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {c.document_links?.map((doc: any) => {
                    const key = makeKey(c.id, doc.document.id)
                    return (
                        <div
                            key={doc.document.id}
                            className="relative rounded-xl border border-gray-200 dark:border-gray-700 transition-all duration-200 hover:shadow-md bg-white dark:bg-gray-800 flex flex-col overflow-visible"
                        >
                            <div
                                className="absolute top-0 left-0 w-1 h-full rounded-l-xl transition-colors duration-200"
                                style={{
                                    background: '#e5e7eb',
                                }}
                            />

                            <div className="p-4 pl-5 flex flex-col flex-1">
                                <div className="flex items-start justify-between gap-2 mb-3">
                                    <div className="flex items-center gap-2 min-w-0">
                                        <TbFileText className="text-gray-400 dark:text-gray-500 shrink-0 text-base" />
                                        <span className="font-semibold text-gray-800 dark:text-gray-100 text-sm leading-tight line-clamp-2">
                                            {doc.document.name}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-1.5 mb-3">
                                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                        <TbHash className="shrink-0" />
                                        <span className="truncate">
                                            {doc.document.number}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                        <TbClockHour4 className="shrink-0" />
                                        <span>
                                            v
                                            {
                                                doc.document.current_version
                                                    ?.full_version
                                            }
                                            {doc.document.current_version
                                                ?.schedule?.type && (
                                                <span className="ml-1 text-gray-400">
                                                    ·{' '}
                                                    {
                                                        doc.document
                                                            .current_version
                                                            .schedule.type
                                                    }
                                                </span>
                                            )}
                                        </span>
                                    </div>
                                </div>

                                <div className="h-px bg-gray-100 dark:bg-gray-700 mb-3" />

                                <div className="space-y-3">
                                    {/* LOCATION */}
                                    <Select
                                        size="sm"
                                        placeholder="Select Location"
                                        options={locationOptions}
                                        value={locationOptions?.find(
                                            (o) =>
                                                o.value ===
                                                selection[key]?.location,
                                        )}
                                        onChange={(o: any) =>
                                            handleSelectionChange(
                                                c.id,
                                                doc.document.id,
                                                'location',
                                                o?.value,
                                            )
                                        }
                                    />

                                    {/* DEPARTMENT */}
                                    <Select
                                        size="sm"
                                        placeholder="Select Department"
                                        options={getDepartmentOptions(key)}
                                        value={getDepartmentOptions(key)?.find(
                                            (o: any) =>
                                                o.value ===
                                                selection[key]?.department,
                                        )}
                                        isDisabled={!selection[key]?.location}
                                        onChange={(o: any) =>
                                            handleSelectionChange(
                                                c.id,
                                                doc.document.id,
                                                'department',
                                                o?.value,
                                            )
                                        }
                                    />

                                    {/* USER */}
                                    <Select
                                        size="sm"
                                        placeholder="Select User"
                                        options={getUserOptions(key)}
                                        value={getUserOptions(key)?.find(
                                            (o) =>
                                                o.value ===
                                                selection[key]?.user,
                                        )}
                                        isDisabled={!selection[key]?.location}
                                        onChange={(o: any) =>
                                            handleSelectionChange(
                                                c.id,
                                                doc.document.id,
                                                'user',
                                                o?.value,
                                            )
                                        }
                                    />

                                    {/* 🔥 PREVIEW */}
                                    {selection[key]?.location && (
                                        <div className="text-xs text-gray-500">
                                            {selection[key]?.user
                                                ? 'Assign to selected user'
                                                : selection[key]?.department
                                                  ? 'Assign to selected department users'
                                                  : 'Assign to all users in location'}
                                        </div>
                                    )}

                                    {/* BUTTON */}
                                    <Button
                                        size="sm"
                                        variant="solid"
                                        className="w-full"
                                        icon={<TbUserCog />}
                                        onClick={() =>
                                            handleAssign(c.id, doc.document)
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

            {c.children?.length > 0 && (
                <div className="ml-6 border-l-2 border-dashed border-gray-200 dark:border-gray-700 pl-4 mt-4">
                    {c.children.map((child: any) => renderClause(child))}
                </div>
            )}
        </div>
    )

    if (isLoading) return <Spinner />

    return (
        <div className="p-6 min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Page Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                        Assign Tasks
                    </h2>
                </div>
            </div>

            {clause?.clauses?.map(renderClause)}

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
