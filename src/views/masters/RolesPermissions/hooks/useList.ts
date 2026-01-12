import {
    apiRoles,
    apiGetRolesList,
    apiGetRolesById,
    apiUpdateRoles,
    apiGetAccesModulesList,
} from '@/services/RolesService'
import useSWR from 'swr'
import { useRolesListStore } from '../store/listStore'
import type { TableQueries } from '@/@types/common'
import { Fields, Roles } from '@/@types/roles'

export default function useRolesList() {
    const {
        tableData,
        filterData,
        setTableData,
        selectedRoles,
        setSelectedRoles,
        setSelectAllRoles,
        setFilterData,
    } = useRolesListStore((state) => state)

    const { data, error, isLoading, mutate } = useSWR(
        ['/api/roles', { ...tableData, ...filterData }],
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_, params]) => apiGetRolesList<Roles[], TableQueries>(params),
        {
            revalidateOnFocus: false,
        },
    )

    const {
        data: modulesData,
        error: modulesError,
        isLoading: modulesLoading,
        mutate: mutateModules,
    } = useSWR(
        '/api/access-modules', // key for SWR caching
        () => apiGetAccesModulesList(),
        {
            revalidateOnFocus: false,
        },
    )
    const saveRolesData = async (roles: Fields) => {
        if (roles.id) {
            await apiUpdateRoles(roles.id, roles)
        } else {
            await apiRoles(roles)
        }
        await mutate() // refresh list
    }

    // ✅ Get single roles by ID (for edit or view)
    const getRolesById = async (id: string) => {
        const roles = await apiGetRolesById(id)
        return roles
    }

    const rolesList = data || []
    const accessModules = modulesData || []

    return {
        rolesList,
        // rolesListTotal,
        error,
        isLoading,
        tableData,
        filterData,
        mutate,
        setTableData,
        selectedRoles,
        setSelectedRoles,
        setSelectAllRoles,
        setFilterData,
        saveRolesData,
        getRolesById, // ✅ Now defined properly
        accessModules,
        modulesError,
        modulesLoading,
        mutateModules,
    }
}
