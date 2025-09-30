import {
    fetchPrefixCategoryList,
    fetchPrefixCategoryById,
    createPrefixCategory,
    updatePrefixCategory,
} from '@/services/CategoriesService'

import { PrefixFormSchema } from '@/@types/common'
import createUsePrefixEntityHook from '@/utils/hooks/usePrefix'

const baseHook = createUsePrefixEntityHook<PrefixFormSchema, PrefixFormSchema>(
    {
        fetchList: fetchPrefixCategoryList,
        fetchById: fetchPrefixCategoryById,
        create: createPrefixCategory,
        update: updatePrefixCategory,
    },
    '/api/category-prefix',
)

export default function usePrefixCategory() {
    const { entity, saveEntity, ...rest } = baseHook()

    return {
        prefixCategory: entity,
        savePrefixCategory: saveEntity,
        ...rest,
    }
}
