import { TbPlaylistAdd } from 'react-icons/tb'
import { ActionButton } from '@/@types/common'
import endpointConfig from '@/configs/endpoint.config'

export const actionButtons: ActionButton[] = [
    // {
    //     label: 'Add Clauses',
    //     icon: <TbPlaylistAdd className="text-xl" />,
    //     path: `${endpointConfig.master.clauses.create}`,
    // },
    {
        label: 'Add Standards',
        icon: <TbPlaylistAdd className="text-xl" />,
        path: `${endpointConfig.setting.clauses.create}`,
    },
]
