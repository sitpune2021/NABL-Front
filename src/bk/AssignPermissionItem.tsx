// this is a replica of the assignroles and permissions component but not in use currently

// /* eslint-disable @typescript-eslint/no-explicit-any */
// import React, { useEffect, useMemo } from 'react'
// import { Controller, useWatch, useFieldArray } from 'react-hook-form'
// import { Button, Select, Checkbox } from '@/components/ui'
// import { FormItem } from '@/components/ui/Form'
// import { HiMinus, HiPlus } from 'react-icons/hi'
// import { useZoneList } from '../../zone/List/hooks/useList'
// import useClusterList from '../../cluster/List/hooks/useList'
// import useLocationList from '../../location/List/hooks/useList'
// import useRolesList from '../../roles/List/hooks/useList'
// import useDepartmentList from '../../department/List/hooks/useList'

// export type AssignPermissionItemProps = {
//     index: number
//     readOnly?: boolean
//     onRemove?: () => void
//     control: any
//     errors: any
//     setValue: any
// }

// const permOptions = ['list', 'write', 'delete', 'data-entry', 'data-review']

// const AssignPermissionItem = ({
//     control,
//     errors,
//     readOnly = false,
//     index,
//     onRemove,
//     setValue,
// }: AssignPermissionItemProps) => {
//     const { zoneList } = useZoneList()
//     const { clusterList } = useClusterList()
//     const { locationList } = useLocationList()
//     const { rolesList, accessModules } = useRolesList()
//     const { departmentList } = useDepartmentList()

//     const {
//         fields: deptFields,
//         append: appendDept,
//         remove: removeDept,
//     } = useFieldArray({
//         control,
//         name: `userRoles.${index}.department`,
//     })

//     const selectedZone = useWatch({
//         control,
//         name: `userRoles.${index}.zone_id`,
//     })
//     const selectedCluster = useWatch({
//         control,
//         name: `userRoles.${index}.cluster_id`,
//     })

//     const zoneOptions = useMemo(
//         () => zoneList.map((z: any) => ({ label: z.name, value: z.id })),
//         [zoneList],
//     )
//     const clusterOptions = useMemo(
//         () =>
//             clusterList
//                 .filter((c: any) => c.zone_id === selectedZone)
//                 .map((c: any) => ({ label: c.name, value: c.id })),
//         [clusterList, selectedZone],
//     )
//     const locationOptions = useMemo(
//         () =>
//             locationList
//                 .filter((l: any) => l.cluster_id === selectedCluster)
//                 .map((l: any) => ({ label: l.name, value: l.id })),
//         [locationList, selectedCluster],
//     )
//     const roleOptions = useMemo(
//         () => rolesList.map((r: any) => ({ label: r.name, value: r.id })),
//         [rolesList],
//     )
//     const departmentOptions = useMemo(
//         () => departmentList.map((d: any) => ({ label: d.name, value: d.id })),
//         [departmentList],
//     )

//     return (
//         <div className="bg-white shadow-lg rounded-xl p-6 mb-6 border border-gray-200">
//             <div className="flex justify-end mb-4">
//                 {!readOnly && onRemove && (
//                     <Button
//                         size="sm"
//                         type="button"
//                         icon={<HiMinus />}
//                         className="border border-blue-500 text-blue-500 rounded-full shadow-md transition-all duration-200"
//                         onClick={onRemove}
//                     />
//                 )}
//             </div>

//             <div className="grid md:grid-cols-3 gap-6 mb-6">
//                 <FormItem
//                     label="Zone"
//                     invalid={!!errors?.userRoles?.[index]?.zone_id}
//                     errorMessage={errors?.userRoles?.[index]?.zone_id?.message}
//                 >
//                     <Controller
//                         name={`userRoles.${index}.zone_id`}
//                         control={control}
//                         render={({ field }) => (
//                             <Select
//                                 options={zoneOptions}
//                                 placeholder="Select Zone"
//                                 isDisabled={readOnly}
//                                 value={zoneOptions.find(
//                                     (o) => o.value === field.value,
//                                 )}
//                                 className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
//                                 onChange={(opt) =>
//                                     field.onChange(opt?.value || '')
//                                 }
//                             />
//                         )}
//                     />
//                 </FormItem>

//                 <FormItem
//                     label="Cluster"
//                     invalid={!!errors?.userRoles?.[index]?.cluster_id}
//                     errorMessage={
//                         errors?.userRoles?.[index]?.cluster_id?.message
//                     }
//                 >
//                     <Controller
//                         name={`userRoles.${index}.cluster_id`}
//                         control={control}
//                         render={({ field }) => (
//                             <Select
//                                 options={clusterOptions}
//                                 placeholder="Select Cluster"
//                                 isDisabled={!selectedZone || readOnly}
//                                 value={clusterOptions.find(
//                                     (o) => o.value === field.value,
//                                 )}
//                                 className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
//                                 onChange={(opt) =>
//                                     field.onChange(opt?.value || '')
//                                 }
//                             />
//                         )}
//                     />
//                 </FormItem>

//                 <FormItem
//                     label="Location"
//                     invalid={!!errors?.userRoles?.[index]?.location_id}
//                     errorMessage={
//                         errors?.userRoles?.[index]?.location_id?.message
//                     }
//                 >
//                     <Controller
//                         name={`userRoles.${index}.location_id`}
//                         control={control}
//                         render={({ field }) => (
//                             <Select
//                                 options={locationOptions}
//                                 placeholder="Select Location"
//                                 isDisabled={!selectedCluster || readOnly}
//                                 value={locationOptions.find(
//                                     (o) => o.value === field.value,
//                                 )}
//                                 className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
//                                 onChange={(opt) =>
//                                     field.onChange(opt?.value || '')
//                                 }
//                             />
//                         )}
//                     />
//                 </FormItem>
//             </div>

//             {deptFields.map((dept, dIndex) => (
//                 <DepartmentBlock
//                     key={dept.id}
//                     index={index}
//                     dIndex={dIndex}
//                     control={control}
//                     errors={errors}
//                     readOnly={readOnly}
//                     removeDept={removeDept}
//                     departmentOptions={departmentOptions}
//                     roleOptions={roleOptions}
//                     rolesList={rolesList}
//                     accessModules={accessModules}
//                     setValue={setValue}
//                 />
//             ))}

//             {!readOnly && (
//                 <Button
//                     size="xs"
//                     type="button"
//                     icon={<HiPlus />}
//                     className="border border-blue-500 text-blue-500 shadow-md transition-all duration-200"
//                     onClick={() =>
//                         appendDept({
//                             department_id: '',
//                             roles: [],
//                             permissions: {},
//                         })
//                     }
//                 >
//                     Add Department
//                 </Button>
//             )}
//         </div>
//     )
// }

// export default AssignPermissionItem

// // ---------------- Department Block ----------------
// const DepartmentBlock = React.memo(
//     ({
//         index,
//         dIndex,
//         control,
//         errors,
//         readOnly,
//         removeDept,
//         departmentOptions,
//         roleOptions,
//         rolesList,
//         accessModules,
//         setValue,
//     }: any) => {
//         const roles =
//             useWatch({
//                 control,
//                 name: `userRoles.${index}.department.${dIndex}.roles`,
//             }) || []

//         const permissions =
//             useWatch({
//                 control,
//                 name: `userRoles.${index}.department.${dIndex}.permissions`,
//             }) || {}

//         // Initialize permissions properly
//         useEffect(() => {
//             if (!Array.isArray(roles)) return

//             const updated: Record<string, any> = {}

//             roles.forEach((roleObj: any) => {
//                 const roleId = roleObj?.value
//                 if (!roleId) return

//                 const roleAccess =
//                     rolesList.find((r: any) => r.id === roleId)?.accessRight ||
//                     {}

//                 // Ensure each module has array of permissions
//                 const formatted: Record<string, string[]> = {}
//                 Object.entries(roleAccess).forEach(([moduleId, perms]: any) => {
//                     formatted[moduleId] = Array.isArray(perms) ? perms : []
//                 })

//                 updated[roleId] = formatted
//             })

//             setValue(
//                 `userRoles.${index}.department.${dIndex}.permissions`,
//                 updated,
//                 { shouldDirty: false },
//             )
//         }, [roles, setValue, rolesList])

//         const setPermission = (
//             role: string,
//             moduleId: string,
//             perm: string,
//         ) => {
//             const rolePerms = permissions[role] || {}
//             const modulePerms = rolePerms[moduleId] || []

//             const updatedModulePerms = modulePerms.includes(perm)
//                 ? modulePerms.filter((p: any) => p !== perm)
//                 : [...modulePerms, perm]

//             setValue(
//                 `userRoles.${index}.department.${dIndex}.permissions.${role}.${moduleId}`,
//                 updatedModulePerms,
//                 { shouldDirty: true },
//             )
//         }

//         return (
//             <div className="relative bg-blue-50/20 border border-blue-200 rounded-lg p-4 mb-4 shadow-sm">
//                 <div className="grid md:grid-cols-2 gap-6 mb-4">
//                     <FormItem
//                         label="Department"
//                         invalid={
//                             !!errors?.userRoles?.[index]?.department?.[dIndex]
//                                 ?.department_id
//                         }
//                         errorMessage={
//                             errors?.userRoles?.[index]?.department?.[dIndex]
//                                 ?.department_id?.message
//                         }
//                     >
//                         <Controller
//                             name={`userRoles.${index}.department.${dIndex}.department_id`}
//                             control={control}
//                             render={({ field }) => (
//                                 <Select
//                                     options={departmentOptions}
//                                     placeholder="Select Department"
//                                     isDisabled={readOnly}
//                                     value={departmentOptions.find(
//                                         (o: { value: any }) =>
//                                             o.value === field.value,
//                                     )}
//                                     className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
//                                     onChange={(opt) =>
//                                         field.onChange(opt?.value || '')
//                                     }
//                                 />
//                             )}
//                         />
//                     </FormItem>

//                     <FormItem
//                         label="Roles"
//                         invalid={
//                             !!errors?.userRoles?.[index]?.department?.[dIndex]
//                                 ?.roles
//                         }
//                         errorMessage={
//                             errors?.userRoles?.[index]?.department?.[dIndex]
//                                 ?.roles?.message
//                         }
//                     >
//                         <Controller
//                             name={`userRoles.${index}.department.${dIndex}.roles`}
//                             control={control}
//                             render={({ field }) => (
//                                 <Select
//                                     isMulti
//                                     options={roleOptions}
//                                     placeholder="Select Roles"
//                                     isDisabled={readOnly}
//                                     value={roleOptions.filter((opt: any) =>
//                                         field.value?.some(
//                                             (r: any) => r.value === opt.value,
//                                         ),
//                                     )}
//                                     className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
//                                     onChange={(selected) =>
//                                         field.onChange(selected || [])
//                                     }
//                                 />
//                             )}
//                         />
//                     </FormItem>
//                 </div>

//                 {roles.length > 0 && (
//                     <div className="mt-6">
//                         {roles.map((r: any) => (
//                             <PermissionTable
//                                 key={r.value}
//                                 role={r.value}
//                                 accessModules={accessModules}
//                                 permissions={permissions[r.value] || {}}
//                                 readOnly={readOnly}
//                                 onToggle={setPermission}
//                             />
//                         ))}
//                     </div>
//                 )}

//                 {!readOnly && dIndex > 0 && (
//                     <div className="absolute top-2 right-2">
//                         <Button
//                             size="xs"
//                             type="button"
//                             icon={<HiMinus />}
//                             className="border border-blue-500 text-blue-500 hover:bg-blue-50 rounded-full shadow-md transition-all duration-200"
//                             onClick={() => removeDept(dIndex)}
//                         />
//                     </div>
//                 )}
//             </div>
//         )
//     },
// )

// // ---------------- Permission Table ----------------
// const PermissionTable = React.memo(
//     ({ role, permissions, accessModules, onToggle, readOnly }: any) => {
//         if (!accessModules || Object.keys(accessModules).length === 0)
//             return null

//         // Flatten modules for rendering
//         const modulesList = Object.values(accessModules).flat()

//         return (
//             <div className="mb-6 border border-gray-300 rounded-lg bg-white shadow-md overflow-hidden">
//                 <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-3 border-b">
//                     <h5 className="text-md font-semibold text-white">
//                         Permissions for: {role}
//                     </h5>
//                 </div>

//                 <table className="min-w-full text-sm">
//                     <thead className="bg-blue-100">
//                         <tr>
//                             <th className="px-4 py-3 text-left font-semibold text-blue-800">
//                                 Module
//                             </th>
//                             {permOptions.map((p) => (
//                                 <th
//                                     key={p}
//                                     className="px-3 py-3 text-center font-semibold text-blue-800"
//                                 >
//                                     {p.replace('-', ' ')}
//                                 </th>
//                             ))}
//                         </tr>
//                     </thead>

//                     <tbody>
//                         {modulesList.map((mod: any, idx: number) => (
//                             <tr
//                                 key={mod.id}
//                                 className={`hover:bg-blue-50 transition-colors duration-150 ${
//                                     idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
//                                 }`}
//                             >
//                                 <td className="px-4 py-3 border-t font-medium text-gray-800">
//                                     {mod.name}
//                                 </td>

//                                 {permOptions.map((perm) => (
//                                     <td
//                                         key={perm}
//                                         className="text-center border-t px-2 py-3"
//                                     >
//                                         {mod.accessor.some(
//                                             (a: any) => a.value === perm,
//                                         ) ? (
//                                             <Checkbox
//                                                 checked={permissions?.[
//                                                     mod.id
//                                                 ]?.includes(perm)}
//                                                 disabled={readOnly}
//                                                 className="rounded focus:ring-blue-500"
//                                                 onChange={() =>
//                                                     onToggle(role, mod.id, perm)
//                                                 }
//                                             />
//                                         ) : (
//                                             <span className="text-gray-400">
//                                                 —
//                                             </span>
//                                         )}
//                                     </td>
//                                 ))}
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>
//         )
//     },
// )
