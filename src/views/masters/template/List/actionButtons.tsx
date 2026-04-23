import { TbPlaylistAdd } from 'react-icons/tb'
import { ActionButton } from '@/@types/common'
import endpointConfig from '@/configs/endpoint.config'

export const actionButtons: ActionButton[] = [
    {
        label: 'New Header',
        icon: <TbPlaylistAdd className="text-xl" />,
        path: `${endpointConfig.master.template.create}/header`,
    },
    {
        label: 'New Footer',
        icon: <TbPlaylistAdd className="text-xl" />,
        path: `${endpointConfig.master.template.create}/footer`,
    },
]
