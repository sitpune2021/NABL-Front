import { TbTemplate } from 'react-icons/tb'
import { ActionButton } from '@/@types/common'
import endpointConfig from '@/configs/endpoint.config'

export const actionButtons: ActionButton[] = [
    {
        label: 'Add New Unit',
        icon: <TbTemplate className="text-xl" />,
        path: `${endpointConfig.setting.unit.create}`,
    },
]
