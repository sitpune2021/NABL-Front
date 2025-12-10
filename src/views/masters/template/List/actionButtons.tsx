import { TbTemplate } from 'react-icons/tb'
import { ActionButton } from '@/@types/common'
import endpointConfig from '@/configs/endpoint.config'

export const actionButtons: ActionButton[] = [
    {
        label: 'Add New Header',
        icon: <TbTemplate className="text-xl" />,
        path: `${endpointConfig.master.template.create}/header`,
    },
    {
        label: 'Add New Footer',
        icon: <TbTemplate className="text-xl" />,
        path: `${endpointConfig.master.template.create}/footer`,
    },
]
