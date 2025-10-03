import {
    fetchPrefixUnitList,
    fetchPrefixUnitById,
    createPrefixUnit,
    updatePrefixUnit,
} from '@/services/UnitService'

import { PrefixFormSchema } from '@/@types/common'
import createUsePrefixEntityHook from '@/utils/hooks/usePrefix'

const baseHook = createUsePrefixEntityHook<PrefixFormSchema, PrefixFormSchema>(
    {
        fetchList: fetchPrefixUnitList,
        fetchById: fetchPrefixUnitById,
        create: createPrefixUnit,
        update: updatePrefixUnit,
    },
    '/api/unit-prefix',
)

export default function usePrefixUnit() {
    const { entity, saveEntity, ...rest } = baseHook()

    return {
        prefixUnit: entity,
        savePrefixUnit: saveEntity,
        ...rest,
    }
}
