/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from 'react'
import Button from '@/components/ui/Button'
import Avatar from '@/components/ui/Avatar'
import Segment from '@/components/ui/Segment'
import Dialog from '@/components/ui/Dialog'
import Input from '@/components/ui/Input'
import ScrollBar from '@/components/ui/ScrollBar'
import { Form, FormItem } from '@/components/ui/Form'
import { useRolePermissionsStore } from '../store/rolePermissionsStore'
import classNames from '@/utils/classNames'
import isLastChild from '@/utils/isLastChild'
import {
    TbUserCog,
    TbBox,
    TbSettings,
    TbFiles,
    TbFileChart,
    TbCheck,
} from 'react-icons/tb'
import {
    MutateRolesPermissionsRolesResponse,
    Roles,
    RolesFormSchema,
} from '@/@types/roles'
import type { ReactNode } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Notification, toast, Checkbox } from '@/components/ui'
import useRolesList from '../hooks/useList'

const validationSchema = z.object({
    name: z.string().trim().min(1, { message: 'Name is required' }),
    description: z
        .string()
        .trim()
        .min(1, { message: 'Description is required' }),
    level: z.number().min(1, { message: 'Level is required' }),
})

type RolesPermissionsAccessDialogProps = {
    roleList: Roles[]
    mutate: MutateRolesPermissionsRolesResponse
    roleLevelsList: any
    accessModules: any
}

const moduleIcon: Record<string, ReactNode> = {
    category: <TbUserCog />,
    subcategory: <TbUserCog />,
    department: <TbBox />,
    template: <TbFiles />,
    document: <TbFileChart />,
    lab: <TbBox />,
    zone: <TbSettings />,
    cluster: <TbSettings />,
    location: <TbSettings />,
    instrument: <TbBox />,
    signatoryBy: <TbUserCog />,
    unit: <TbSettings />,
    rolesPermission: <TbSettings />,
    user: <TbUserCog />,
    clauses: <TbFiles />,
    config: <TbSettings />,
}

const RolesPermissionsAccessDialog = ({
    roleList,
    mutate,
    roleLevelsList,
    accessModules,
}: RolesPermissionsAccessDialogProps) => {
    const { saveRolesData } = useRolesList()

    const { selectedRole, setRoleDialog, roleDialog } =
        useRolePermissionsStore()
    const isEdit = roleDialog.type === 'edit'
    const nextLevel = roleLevelsList.length + 1

    const {
        handleSubmit,
        formState: { errors },
        control,
        reset,
    } = useForm<RolesFormSchema>({
        defaultValues: {
            name: '',
            description: '',
            level: nextLevel,
        },
        resolver: isEdit ? undefined : zodResolver(validationSchema),
    })

    const [accessRight, setAccessRight] = useState<Record<string, string[]>>({})
    const [isSubmitting, setIsSubmitting] = useState(false)

    //  NEW: Level error state
    const [levelError, setLevelError] = useState<string | null>(null)

    //  Get logged-in user's min level (approx from existing roles)
    const userMinLevel = useMemo(() => {
        return roleLevelsList.length ? Math.min(...roleLevelsList) : 1
    }, [roleLevelsList])

    //  Validate level
    const handleLevelChange = (value: number) => {
        const existingRole = roleList.find(
            (role: any) => Number(role.level) === Number(value),
        )

        if (value <= userMinLevel) {
            setLevelError(
                'You cannot create a role at this level or above your level',
            )
        } else if (existingRole) {
            setLevelError(
                `${existingRole.name} is already at level ${value}. If you create a new role here, the existing role will be moved to the next level.`,
            )
        } else {
            setLevelError(null)
        }
    }

    // Flatten accessRight
    useEffect(() => {
        if (roleDialog.type === 'edit') {
            const role = roleList.find((r) => r.id === selectedRole)
            const flatAccess: Record<string, string[]> = {}

            if (role?.accessRight) {
                Object.values(role.accessRight).forEach((group: any) => {
                    if (typeof group !== 'object') return
                    Object.entries(group).forEach(
                        ([moduleId, actions]: any) => {
                            if (!Array.isArray(actions)) return
                            //  SPECIAL FIX FOR LAB + ASSIGNMENTS
                            if (moduleId === 'lab') {
                                const labAccess: string[] = []
                                const assignmentAccess: string[] = []

                                actions.forEach((action: string) => {
                                    if (action.startsWith('assignments.')) {
                                        assignmentAccess.push(
                                            action.replace('assignments.', ''),
                                        )
                                    } else {
                                        labAccess.push(action)
                                    }
                                })

                                flatAccess['lab'] = labAccess
                                flatAccess['assignments'] = assignmentAccess
                            } else {
                                flatAccess[moduleId] = actions
                            }
                        },
                    )
                })
            }

            Object.values(accessModules)
                .flat()
                .forEach((module: any) => {
                    if (!flatAccess[module.id]) {
                        flatAccess[module.id] = []
                    }
                })
            setAccessRight(flatAccess)
        } else if (roleDialog.type === 'new') {
            const defaultAccess: Record<string, string[]> = {}
            Object.values(accessModules)
                .flat()
                .forEach((module: any) => {
                    defaultAccess[module.id] = module.accessor.map(
                        (item: any) => item.value,
                    )
                })
            setAccessRight(defaultAccess)
        }
    }, [accessModules, roleDialog.type, roleList, selectedRole])

    const handleClose = () => {
        setRoleDialog({ type: '', open: false })
    }

    const onSubmit = async (values: RolesFormSchema) => {
        if (levelError) return
        const payload: any = isEdit
            ? { id: selectedRole, accessRight }
            : {
                  name: values.name,
                  description: values.description,
                  level: values.level,
                  accessRight,
              }
        console.log('🔥 FINAL PAYLOAD', payload)
        console.log('🧾 Current Role:', currentRole)

        setIsSubmitting(true)
        try {
            await saveRolesData(payload)
            toast.push(
                <Notification type="success">
                    {isEdit ? 'Role updated!' : 'Role created!'}
                </Notification>,
            )
            handleClose()
        } catch (err) {
            console.error(err)
            toast.push(
                <Notification type="danger">Error saving role</Notification>,
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleChange = (selected: string[], moduleId: string) => {
        setAccessRight((prev) => ({ ...prev, [moduleId]: selected }))

        if (roleDialog.type === 'edit') {
            const newRoleList: any = structuredClone(roleList).map(
                (role: any) => {
                    if (role.id === selectedRole) {
                        role.accessRight[moduleId] = selected
                    }
                    return role
                },
            )
            mutate(newRoleList, false)
        }
    }
    const handleGroupSelectAll = (groupModules: any[], checked: boolean) => {
        const updatedAccess = { ...accessRight }
        groupModules.forEach((module) => {
            if (checked) {
                updatedAccess[module.id] = module.accessor.map(
                    (item: any) => item.value,
                )
            } else {
                updatedAccess[module.id] = []
            }
        })
        setAccessRight(updatedAccess)
    }

    const currentRole = useMemo(
        () => roleList.find((role: any) => role.id === selectedRole),
        [selectedRole, roleList],
    )

    useEffect(() => {
        if (isEdit && currentRole) {
            reset({
                name: currentRole.name,
                description: currentRole.description,
                level: currentRole.level,
            })
        }
    }, [isEdit, currentRole, reset])
    useEffect(() => {
        if (roleDialog.type === 'new') {
            reset({
                name: '',
                description: '',
                level: nextLevel,
            })
        }
    }, [roleDialog.type, nextLevel, reset])

    return (
        <Dialog
            isOpen={roleDialog.open}
            width={900}
            onClose={handleClose}
            onRequestClose={handleClose}
        >
            <h4>
                {roleDialog.type === 'new' ? 'Create role' : currentRole?.name}
            </h4>
            <ScrollBar className="mt-6 max-h-[600px] overflow-y-auto">
                <Form
                    className="px-4"
                    containerClassName="flex flex-col w-full justify-between"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    {roleDialog.type === 'new' && (
                        <>
                            <FormItem
                                label="Role name"
                                invalid={!!errors.name}
                                errorMessage={errors.name?.message}
                            >
                                <Controller
                                    name="name"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            type="text"
                                            placeholder="Role Name"
                                            autoComplete="off"
                                            {...field}
                                        />
                                    )}
                                />
                            </FormItem>
                            {/* Level */}
                            <FormItem
                                label="Level"
                                invalid={!!errors.level || !!levelError}
                                errorMessage={
                                    errors.level?.message ||
                                    levelError ||
                                    undefined
                                }
                            >
                                <Controller
                                    name="level"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            type="number"
                                            min={1}
                                            placeholder="Enter role level"
                                            {...field}
                                            onChange={(e) => {
                                                const value = Number(
                                                    e.target.value,
                                                )
                                                field.onChange(value)
                                                handleLevelChange(value)
                                            }}
                                        />
                                    )}
                                />
                            </FormItem>
                            <FormItem
                                label="Description"
                                invalid={!!errors.description}
                                errorMessage={errors.description?.message}
                            >
                                <Controller
                                    name="description"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            textArea
                                            placeholder="Description"
                                            autoComplete="off"
                                            {...field}
                                        />
                                    )}
                                />
                            </FormItem>
                            <span className="font-semibold mb-2">
                                Permission
                            </span>
                        </>
                    )}

                    {Object.entries(accessModules).map(
                        ([group, modules]: any) => (
                            <div key={group} className="mb-8">
                                <div className="flex items-center justify-between mb-4 bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg">
                                    <h5 className="font-bold text-lg capitalize">
                                        {group}
                                    </h5>
                                    <Checkbox
                                        checked={modules.every(
                                            (module: any) =>
                                                accessRight[module.id]
                                                    ?.length ===
                                                module.accessor.length,
                                        )}
                                        onChange={(checked) =>
                                            handleGroupSelectAll(
                                                modules,
                                                checked as boolean,
                                            )
                                        }
                                    >
                                        Select All
                                    </Checkbox>
                                </div>
                                {modules.map((module: any, index: number) => (
                                    <div
                                        key={module.id}
                                        className={classNames(
                                            'flex flex-col md:flex-row md:items-center justify-between gap-4 py-6 border-gray-200 dark:border-gray-600',
                                            !isLastChild(modules, index) &&
                                                'border-b',
                                        )}
                                    >
                                        <div className="flex items-center gap-4">
                                            <Avatar
                                                className="bg-transparent dark:bg-transparent p-2 border-2 border-gray-200 dark:border-gray-600 text-primary"
                                                size={50}
                                                icon={moduleIcon[module.id]}
                                                shape="round"
                                            />
                                            <div>
                                                <h6 className="font-bold">
                                                    {module.name}
                                                </h6>
                                                <span>
                                                    {module.description}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <Segment
                                                className="bg-transparent dark:bg-transparent flex-wrap justify-end"
                                                selectionType="multiple"
                                                value={
                                                    accessRight[module.id] || []
                                                }
                                                onChange={(val) =>
                                                    handleChange(
                                                        val as string[],
                                                        module.id,
                                                    )
                                                }
                                            >
                                                {module.accessor.map(
                                                    (access: any) => (
                                                        <Segment.Item
                                                            key={
                                                                module.id +
                                                                access.value
                                                            }
                                                            value={access.value}
                                                        >
                                                            {({
                                                                active,
                                                                onSegmentItemClick,
                                                            }) => (
                                                                <Button
                                                                    variant="default"
                                                                    icon={
                                                                        active ? (
                                                                            <TbCheck className="text-primary text-xl" />
                                                                        ) : null
                                                                    }
                                                                    active={
                                                                        active
                                                                    }
                                                                    type="button"
                                                                    className="md:min-w-[100px]"
                                                                    size="sm"
                                                                    customColorClass={({
                                                                        active,
                                                                    }) =>
                                                                        classNames(
                                                                            active &&
                                                                                'bg-transparent dark:bg-transparent text-primary border-primary ring-1 ring-primary',
                                                                        )
                                                                    }
                                                                    onClick={
                                                                        onSegmentItemClick
                                                                    }
                                                                >
                                                                    {
                                                                        access.label
                                                                    }
                                                                </Button>
                                                            )}
                                                        </Segment.Item>
                                                    ),
                                                )}
                                            </Segment>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ),
                    )}

                    <div className="flex justify-end mt-6 sticky bottom-0 bg-white dark:bg-gray-800 py-4 border-t border-gray-200 dark:border-gray-600">
                        <Button
                            className="ltr:mr-2 rtl:ml-2"
                            variant="default"
                            onClick={handleClose}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="solid"
                            type="submit"
                            loading={isSubmitting}
                        >
                            {roleDialog.type === 'edit' ? 'Update' : 'Create'}
                        </Button>
                    </div>
                </Form>
            </ScrollBar>
        </Dialog>
    )
}

export default RolesPermissionsAccessDialog
