import { TbPlaylistAdd } from 'react-icons/tb'
import endpointConfig from '@/configs/endpoint.config'

export const actionButtons = [
    {
        label: 'New',
        icon: <TbPlaylistAdd className="text-xl" />,
        path: endpointConfig.setting.prefixConfig.create,
    },
]
