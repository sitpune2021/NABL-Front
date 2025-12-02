/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo, useEffect } from 'react'
import Avatar from '@/components/ui/Avatar'
import Dropdown from '@/components/ui/Dropdown'
import { HiCheck } from 'react-icons/hi'
import { useSessionUser } from '@/store/authStore'

const LocationSelector = () => {
    const user: any = useSessionUser((state) => state.user)
    if (user.is_super_admin) return null
    const data = user.roles_structure || []

    const [selectedLocation, setSelectedLocation] = useState<any>(null)
    const [selectedDepartment, setSelectedDepartment] = useState<any>(null)
    const [selectedRole, setSelectedRole] = useState<any>(null)

    // ===== MAP LOCATIONS =====
    const locations = useMemo(() => {
        return data.map((item: any) => ({
            id: item.location_id,
            name: item.location_name,
            icon: '/img/icons/location.png',
            departments: item.departments,
        }))
    }, [data])

    // ===== DEFAULT SELECTION =====
    useEffect(() => {
        if (locations.length > 0 && !selectedLocation) {
            const firstLoc = locations[0]
            setSelectedLocation(firstLoc)

            const firstDept = firstLoc.departments?.[0]
            setSelectedDepartment(firstDept || null)

            const firstRole = firstDept?.roles?.[0]
            setSelectedRole(firstRole || null)
        }
    }, [locations])

    const departments = useMemo(() => {
        if (!selectedLocation) return []
        return selectedLocation.departments.map((d: any) => ({
            ...d,
            icon: '/img/icons/department.png',
        }))
    }, [selectedLocation])

    const roles = useMemo(() => {
        if (!selectedDepartment) return []
        return selectedDepartment.roles.map((r: any) => ({
            ...r,
            icon: '/img/icons/role.png',
        }))
    }, [selectedDepartment])

    return (
        <div className="flex gap-4">
            {/* LOCATION DROPDOWN */}
            <Dropdown
                placement="bottom-end"
                renderTitle={
                    <span className="flex items-center">
                        <Avatar size={20} src={selectedLocation?.icon} />
                        <span className="ml-2">
                            {selectedLocation?.name || 'Location'}
                        </span>
                    </span>
                }
            >
                {locations.map((loc: any) => (
                    <Dropdown.Item
                        key={loc.id}
                        className="justify-between"
                        onClick={() => {
                            setSelectedLocation(loc)

                            const firstDept = loc.departments?.[0]
                            setSelectedDepartment(firstDept || null)

                            const firstRole = firstDept?.roles?.[0]
                            setSelectedRole(firstRole || null)
                        }}
                    >
                        <span className="flex items-center">
                            <Avatar size={18} src={loc.icon} />
                            <span className="ml-2">{loc.name}</span>
                        </span>

                        {selectedLocation?.id === loc.id && (
                            <HiCheck className="text-emerald-500 text-lg" />
                        )}
                    </Dropdown.Item>
                ))}
            </Dropdown>

            {/* DEPARTMENT DROPDOWN */}
            <Dropdown
                placement="bottom-end"
                renderTitle={
                    <span className="flex items-center">
                        <Avatar size={20} src={selectedDepartment?.icon} />
                        <span className="ml-2">
                            {selectedDepartment?.department_name ||
                                'Department'}
                        </span>
                    </span>
                }
            >
                {departments.map((dept: any) => (
                    <Dropdown.Item
                        key={dept.department_id}
                        className="justify-between"
                        onClick={() => {
                            setSelectedDepartment(dept)
                            setSelectedRole(dept.roles?.[0] || null)
                        }}
                    >
                        <span className="flex items-center">
                            <Avatar size={18} src={dept.icon} />
                            <span className="ml-2">{dept.department_name}</span>
                        </span>

                        {selectedDepartment?.department_id ===
                            dept.department_id && (
                            <HiCheck className="text-emerald-500 text-lg" />
                        )}
                    </Dropdown.Item>
                ))}
            </Dropdown>

            {/* ROLE DROPDOWN */}
            <Dropdown
                placement="bottom-end"
                renderTitle={
                    <span className="flex items-center">
                        <Avatar size={20} src={selectedRole?.icon} />
                        <span className="ml-2">
                            {selectedRole?.role_name || 'Role'}
                        </span>
                    </span>
                }
            >
                {roles.map((role: any) => (
                    <Dropdown.Item
                        key={role.role_id}
                        className="justify-between"
                        onClick={() => setSelectedRole(role)}
                    >
                        <span className="flex items-center">
                            <Avatar size={18} src={role.icon} />
                            <span className="ml-2">{role.role_name}</span>
                        </span>

                        {selectedRole?.role_id === role.role_id && (
                            <HiCheck className="text-emerald-500 text-lg" />
                        )}
                    </Dropdown.Item>
                ))}
            </Dropdown>
        </div>
    )
}

export default LocationSelector
