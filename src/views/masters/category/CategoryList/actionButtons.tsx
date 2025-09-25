import { TbTemplate } from 'react-icons/tb'
import { MASTER_PREFIX_PATH } from '@/constants/route.constant'
import { ActionButton } from '@/@types/common'

export const actionButtons: ActionButton[] = [
    {
        label: 'Add new Category',
        icon: <TbTemplate className="text-xl" />,
        path: `${MASTER_PREFIX_PATH}/category/create`,
    },
]
