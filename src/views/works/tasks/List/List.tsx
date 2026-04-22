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
    TbMapPin,
    TbBuildingSkyscraper,
    TbUsers,
    TbChevronRight,
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

    const makeKey = (c: number, d: number) => `${c}_${d}`

    // ─── MAP FLAT API RESPONSE → NESTED SELECTION STATE ───────────────────────
    //
    // The API returns one flat row per (clause, document, location, department, user).
    // Example with your response:
    //   row 1: clause=1, doc=2, loc=11, dept=11, user=null  (scope=department)
    //   row 2: clause=1, doc=2, loc=11, dept=15, user=6     (scope=user)
    //
    // We group into:
    //   selection["1_2"] = {
    //     locations: [
    //       {
    //         id: "11",
    //         departments: [
    //           { id: "11", users: [] },     ← dept-only, no user
    //           { id: "15", users: [6] },    ← user assigned
    //         ]
    //       }
    //     ]
    //   }
    useEffect(() => {
        if (!assignment?.length) return

        // Build:  key → locId → deptId → Set<userId>
        const tree: Record<
            string,
            Record<string, Record<string, Set<number>>>
        > = {}

        assignment.forEach((item: any) => {
            const key = `${item.clause_id}_${item.document_id}`
            const locId = String(item.location_id)
            const deptId = String(item.department_id)

            if (!tree[key]) tree[key] = {}
            if (!tree[key][locId]) tree[key][locId] = {}
            if (!tree[key][locId][deptId]) tree[key][locId][deptId] = new Set()

            // Add user only when one exists (scope_type === "user")
            if (item.user_id != null) {
                tree[key][locId][deptId].add(item.user_id)
            }
        })

        // Convert tree → selection shape expected by the UI
        const mapped: any = {}
        Object.entries(tree).forEach(([key, locations]) => {
            mapped[key] = {
                locations: Object.entries(locations).map(([locId, depts]) => ({
                    id: locId,
                    departments: Object.entries(depts).map(
                        ([deptId, users]) => ({
                            id: deptId,
                            users: Array.from(users), // number[]
                        }),
                    ),
                })),
            }
        })

        setSelection(mapped)
    }, [assignment])

    // ─── HANDLERS ─────────────────────────────────────────────────────────────

    const handleLocationChange = (
        clauseId: number,
        docId: number,
        values: any[],
    ) => {
        const key = makeKey(clauseId, docId)
        setSelection((prev: any) => {
            const existing = prev[key]?.locations || []
            const updatedLocations = values.map((locId: any) => {
                const found = existing.find((l: any) => l.id === locId)
                return found || { id: locId, departments: [] }
            })
            return { ...prev, [key]: { locations: updatedLocations } }
        })
    }

    const handleDepartmentChange = (
        key: string,
        locIndex: number,
        values: any[],
    ) => {
        setSelection((prev: any) => {
            const updated = [...(prev[key]?.locations || [])]
            // Preserve existing users when departments list changes
            updated[locIndex].departments = values.map((id: any) => {
                const existing = updated[locIndex].departments?.find(
                    (d: any) => d.id === id,
                )
                return existing || { id, users: [] }
            })
            return { ...prev, [key]: { locations: updated } }
        })
    }

    const handleUserChange = (
        key: string,
        locIndex: number,
        deptIndex: number,
        users: any[],
    ) => {
        setSelection((prev: any) => {
            const updated = [...(prev[key]?.locations || [])]
            updated[locIndex].departments[deptIndex].users = users.map(
                (u: any) => u.value,
            )
            return { ...prev, [key]: { locations: updated } }
        })
    }

    const locationOptions = locationList?.map((l: any) => ({
        value: String(l.id),
        label: l.name,
    }))

    // ─── ASSIGN ───────────────────────────────────────────────────────────────

    const handleAssign = async (clauseId: number, doc: any) => {
        const key = makeKey(clauseId, doc.id)
        const locations = selection[key]?.locations || []
        const payload = {
            clause_id: clauseId,
            document_id: doc.id,
            locations: locations.map((loc: any) => ({
                id: Number(loc.id),
                departments: (loc.departments || []).map((dept: any) => ({
                    id: Number(dept.id),
                    users: (dept.users || []).map((u: any) => ({
                        id: Number(u),
                    })),
                })),
            })),
        }
        console.log('🔥 FINAL PAYLOAD:', payload)
        try {
            await apiLabTaskAssign(payload)

            setSuccessDialog({
                open: true,
                userName: `${payload.locations.flatMap((loc: any) => loc.departments.flatMap((dept: any) => dept.users)).length} users`,
                docName: doc.name,
            })
        } catch (e) {
            console.error(e)
            alert('Assignment failed')
        }
    }

    // ─── RENDER ───────────────────────────────────────────────────────────────

    const renderClause = (c: any) => (
        <div key={c.id} className="mt-8">
            {/* Clause Header */}
            <div className="flex items-center gap-3 mb-5">
                <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-md shadow-primary-200 dark:shadow-primary-900/40">
                    <TbLayersLinked className="text-white text-lg" />
                </div>
                <div className="flex flex-col">
                    <span className="text-[11px] font-semibold uppercase tracking-widest text-primary-500 dark:text-primary-400 leading-none mb-0.5">
                        Clause
                    </span>
                    <h4 className="font-bold text-gray-800 dark:text-gray-100 text-[15px] leading-tight">
                        {c.numbering_value} — {c.title}
                    </h4>
                </div>
                <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent dark:from-gray-700 ml-1" />
                <Tag className="bg-primary-50 dark:bg-primary-900/25 text-primary-600 dark:text-primary-400 border border-primary-100 dark:border-primary-800 text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
                    {c.document_links?.length ?? 0} Documents
                </Tag>
            </div>

            {/* Document Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {c.document_links?.map((doc: any) => {
                    const key = makeKey(c.id, doc.document.id)

                    return (
                        <div
                            key={doc.document.id}
                            className="group relative rounded-2xl border border-gray-200/80 dark:border-gray-700/60 bg-white dark:bg-gray-800 shadow-sm hover:shadow-lg hover:shadow-gray-100 dark:hover:shadow-gray-900/40 transition-all duration-300 flex flex-col overflow-hidden"
                        >
                            {/* Top accent bar */}
                            <div className="h-1 w-full bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600" />

                            <div className="p-5 flex flex-col flex-1 gap-4">
                                {/* Document Info */}
                                <div className="flex flex-col gap-2.5">
                                    <div className="flex items-start gap-2.5">
                                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-900/30 shrink-0 mt-0.5">
                                            <TbFileText className="text-primary-500 dark:text-primary-400 text-base" />
                                        </div>
                                        <span className="font-semibold text-gray-800 dark:text-gray-100 text-sm leading-snug line-clamp-2">
                                            {doc.document.name}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-3 pl-10">
                                        <span className="flex items-center gap-1.5 text-[11px] text-gray-400 dark:text-gray-500 font-medium">
                                            <TbHash className="text-gray-300 dark:text-gray-600 shrink-0" />
                                            {doc.document.number}
                                        </span>
                                        <span className="w-1 h-1 rounded-full bg-gray-200 dark:bg-gray-600" />
                                        <span className="flex items-center gap-1.5 text-[11px] text-gray-400 dark:text-gray-500 font-medium">
                                            <TbClockHour4 className="text-gray-300 dark:text-gray-600 shrink-0" />
                                            v
                                            {
                                                doc.document.current_version
                                                    ?.full_version
                                            }
                                            {doc.document.current_version
                                                ?.schedule?.type && (
                                                <span className="ml-0.5 text-gray-300 dark:text-gray-600">
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

                                {/* Divider */}
                                <div className="h-px bg-gray-100 dark:bg-gray-700/60" />

                                {/* Assignment Section */}
                                <div className="flex flex-col gap-3">
                                    {/* Location Multi-select */}
                                    <div className="flex flex-col gap-1.5">
                                        <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
                                            <TbMapPin className="text-xs" />
                                            Locations
                                        </label>
                                        <Select
                                            isMulti
                                            placeholder="Select locations…"
                                            options={locationOptions}
                                            value={locationOptions?.filter(
                                                (o) =>
                                                    selection[
                                                        key
                                                    ]?.locations?.some(
                                                        (l: any) =>
                                                            l.id === o.value,
                                                    ),
                                            )}
                                            onChange={(opts: any) =>
                                                handleLocationChange(
                                                    c.id,
                                                    doc.document.id,
                                                    opts.map(
                                                        (o: any) => o.value,
                                                    ),
                                                )
                                            }
                                        />
                                    </div>

                                    {/* Per-location blocks */}
                                    {selection[key]?.locations?.map(
                                        (loc: any, locIndex: number) => {
                                            const locationData =
                                                locationList?.find(
                                                    (l: any) =>
                                                        String(l.id) === loc.id,
                                                ) as any

                                            const deptOptions =
                                                locationData?.departments?.map(
                                                    (d: any) => ({
                                                        value: String(
                                                            d.department.id,
                                                        ),
                                                        label: d.department
                                                            .name,
                                                    }),
                                                ) || []

                                            return (
                                                <div
                                                    key={loc.id}
                                                    className="rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50/60 dark:bg-gray-900/40 p-3 flex flex-col gap-3"
                                                >
                                                    {/* Location name pill */}
                                                    <div className="flex items-center gap-2">
                                                        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-[11px] font-semibold text-gray-600 dark:text-gray-300 shadow-xs">
                                                            <TbMapPin className="text-primary-400 shrink-0 text-xs" />
                                                            {locationData?.name}
                                                        </span>
                                                    </div>

                                                    {/* Department select */}
                                                    <div className="flex flex-col gap-1.5">
                                                        <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
                                                            <TbBuildingSkyscraper className="text-xs" />
                                                            Departments
                                                        </label>
                                                        <Select
                                                            isMulti
                                                            placeholder="Select departments…"
                                                            options={
                                                                deptOptions
                                                            }
                                                            value={deptOptions.filter(
                                                                (o: any) =>
                                                                    loc.departments?.some(
                                                                        (
                                                                            d: any,
                                                                        ) =>
                                                                            d.id ===
                                                                            o.value,
                                                                    ),
                                                            )}
                                                            onChange={(
                                                                opts: any,
                                                            ) =>
                                                                handleDepartmentChange(
                                                                    key,
                                                                    locIndex,
                                                                    opts.map(
                                                                        (
                                                                            o: any,
                                                                        ) =>
                                                                            o.value,
                                                                    ),
                                                                )
                                                            }
                                                        />
                                                    </div>

                                                    {/* User selects per department */}
                                                    {loc.departments?.map(
                                                        (
                                                            dept: any,
                                                            deptIndex: number,
                                                        ) => {
                                                            const deptData =
                                                                locationData?.departments?.find(
                                                                    (d: any) =>
                                                                        String(
                                                                            d
                                                                                .department
                                                                                .id,
                                                                        ) ===
                                                                        String(
                                                                            dept.id,
                                                                        ),
                                                                )
                                                            const users =
                                                                deptData
                                                                    ?.department
                                                                    ?.users ||
                                                                []
                                                            const deptName =
                                                                deptData
                                                                    ?.department
                                                                    ?.name

                                                            return (
                                                                <div
                                                                    key={
                                                                        dept.id
                                                                    }
                                                                    className="flex flex-col gap-1.5"
                                                                >
                                                                    <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
                                                                        <TbUsers className="text-xs" />
                                                                        {deptName
                                                                            ? `${deptName} — Users`
                                                                            : 'Users'}
                                                                    </label>
                                                                    <Select
                                                                        isMulti
                                                                        placeholder="Select users…"
                                                                        options={users.map(
                                                                            (
                                                                                u: any,
                                                                            ) => ({
                                                                                value: u
                                                                                    .user
                                                                                    ?.id,
                                                                                label:
                                                                                    u
                                                                                        .user
                                                                                        ?.name ||
                                                                                    u
                                                                                        .user
                                                                                        ?.email,
                                                                            }),
                                                                        )}
                                                                        // ✅ Match stored user ids (numbers) against options
                                                                        // dept.users = [6, ...] — compare as strings to be safe
                                                                        value={(
                                                                            dept.users ||
                                                                            []
                                                                        ).map(
                                                                            (
                                                                                uid: any,
                                                                            ) => {
                                                                                const user =
                                                                                    users.find(
                                                                                        (
                                                                                            x: any,
                                                                                        ) =>
                                                                                            String(
                                                                                                x
                                                                                                    .user
                                                                                                    ?.id,
                                                                                            ) ===
                                                                                            String(
                                                                                                uid,
                                                                                            ),
                                                                                    )
                                                                                return {
                                                                                    value: uid,
                                                                                    label:
                                                                                        user
                                                                                            ?.user
                                                                                            ?.name ||
                                                                                        user
                                                                                            ?.user
                                                                                            ?.email ||
                                                                                        String(
                                                                                            uid,
                                                                                        ),
                                                                                }
                                                                            },
                                                                        )}
                                                                        onChange={(
                                                                            vals: any,
                                                                        ) =>
                                                                            handleUserChange(
                                                                                key,
                                                                                locIndex,
                                                                                deptIndex,
                                                                                vals,
                                                                            )
                                                                        }
                                                                    />
                                                                </div>
                                                            )
                                                        },
                                                    )}
                                                </div>
                                            )
                                        },
                                    )}
                                </div>
                            </div>

                            {/* Assign Button */}
                            <div className="px-5 pb-5">
                                <Button
                                    block
                                    size="sm"
                                    variant="solid"
                                    className="rounded-xl font-semibold text-sm tracking-wide shadow-sm shadow-primary-200 dark:shadow-primary-900/30 transition-all duration-200 hover:shadow-md hover:shadow-primary-300 dark:hover:shadow-primary-800/40 active:scale-[0.98]"
                                    icon={<TbCheck />}
                                    onClick={() =>
                                        handleAssign(c.id, doc.document)
                                    }
                                >
                                    Assign Task
                                </Button>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Children clauses */}
            {c.children?.length > 0 && (
                <div className="ml-8 border-l-2 border-dashed border-gray-200 dark:border-gray-700 pl-5 mt-6">
                    {c.children.map((child: any) => renderClause(child))}
                </div>
            )}
        </div>
    )

    if (isLoading)
        return (
            <div className="flex items-center justify-center min-h-[40vh]">
                <div className="flex flex-col items-center gap-3">
                    <Spinner size="40px" />
                    <span className="text-sm text-gray-400 dark:text-gray-500 font-medium">
                        Loading tasks…
                    </span>
                </div>
            </div>
        )

    return (
        <div className="px-6 py-8 min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Page Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                        <TbUserCog className="text-sm" />
                        Lab Management
                        <TbChevronRight className="text-xs" />
                        <span className="text-primary-500 dark:text-primary-400">
                            Assign Tasks
                        </span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
                        Task Assignment
                    </h2>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">
                        Assign documents to locations, departments, and team
                        members.
                    </p>
                </div>
            </div>

            {/* Clauses */}
            <div className="flex flex-col gap-2">
                {clause?.clauses?.map(renderClause)}
            </div>

            {/* Success Dialog */}
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
                <div className="relative overflow-hidden rounded-2xl">
                    <div className="absolute top-0 left-0 right-0 h-36 bg-gradient-to-br from-primary-500 to-primary-700" />
                    <div className="absolute top-3 right-3 w-24 h-24 rounded-full bg-white/10" />
                    <div className="absolute top-10 right-14 w-12 h-12 rounded-full bg-white/10" />
                    <div className="absolute -top-3 left-8 w-16 h-16 rounded-full bg-white/5" />

                    <div className="relative pt-12 pb-7 px-6 flex flex-col items-center">
                        <div className="w-16 h-16 rounded-2xl bg-white shadow-xl shadow-primary-300/40 flex items-center justify-center mb-4 rotate-3">
                            <TbConfetti className="text-primary-600 text-3xl" />
                        </div>

                        <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                            Successfully Assigned!
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5 text-center leading-relaxed">
                            The document has been assigned to a team member and
                            the task is now active.
                        </p>

                        <div className="w-full mt-5 bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 flex items-center gap-3">
                            <div className="flex-1 min-w-0 flex flex-col items-center gap-2 bg-white dark:bg-gray-700 rounded-xl p-3.5 shadow-sm border border-gray-100 dark:border-gray-600">
                                <div className="w-9 h-9 rounded-lg bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center">
                                    <TbFileText className="text-primary-500 text-lg" />
                                </div>
                                <span className="text-xs font-semibold text-gray-700 dark:text-gray-200 text-center line-clamp-2 leading-tight">
                                    {successDialog.docName}
                                </span>
                            </div>

                            <div className="shrink-0">
                                <div className="w-7 h-7 rounded-full bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center shadow-sm">
                                    <TbArrowRight className="text-primary-600 dark:text-primary-400 text-sm" />
                                </div>
                            </div>

                            <div className="flex-1 min-w-0 flex flex-col items-center gap-2 bg-white dark:bg-gray-700 rounded-xl p-3.5 shadow-sm border border-gray-100 dark:border-gray-600">
                                <Avatar
                                    size={36}
                                    shape="circle"
                                    className="bg-gradient-to-br from-primary-400 to-primary-600 text-white font-bold shadow-sm"
                                >
                                    {successDialog.userName
                                        ?.charAt(0)
                                        ?.toUpperCase()}
                                </Avatar>
                                <span className="text-xs font-semibold text-gray-700 dark:text-gray-200 text-center line-clamp-2 leading-tight">
                                    {successDialog.userName}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 mt-4 px-4 py-2 rounded-full bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                            <div className="w-4 h-4 rounded-full bg-green-100 dark:bg-green-800 flex items-center justify-center">
                                <TbCheck className="text-green-600 dark:text-green-400 text-[10px]" />
                            </div>
                            <span className="text-xs font-semibold text-green-700 dark:text-green-400 tracking-wide">
                                Task is now active
                            </span>
                        </div>

                        <Button
                            className="mt-5 w-full rounded-xl font-semibold"
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
