import {
    fetchPrefixDepartmentList,
    fetchPrefixDepartmentById,
    createPrefixDepartment,
    updatePrefixDepartment,
} from '@/services/DepartmentService'

import { PrefixFormSchema } from '@/@types/common'
import createUsePrefixEntityHook from '@/utils/hooks/usePrefix'

const baseHook = createUsePrefixEntityHook<PrefixFormSchema, PrefixFormSchema>(
    {
        fetchList: fetchPrefixDepartmentList,
        fetchById: fetchPrefixDepartmentById,
        create: createPrefixDepartment,
        update: updatePrefixDepartment,
    },
    '/api/department-prefix',
)

export default function usePrefixDepartment() {
    const { entity, saveEntity, ...rest } = baseHook()

    return {
        prefixDepartment: entity,
        savePrefixDepartment: saveEntity,
        ...rest,
    }
}
