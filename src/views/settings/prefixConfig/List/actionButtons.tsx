import { TbPlaylistAdd } from 'react-icons/tb'
import { ActionButton } from '@/@types/common'
import endpointConfig from '@/configs/endpoint.config'

export const actionButtons: ActionButton[] = [
    {
        label: 'New',
        icon: <TbPlaylistAdd className="text-xl" />,
        path: `${endpointConfig.setting.prefixConfig.create}`,
    },
]
