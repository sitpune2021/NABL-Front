import { TbPlaylistAdd } from 'react-icons/tb'
import { ActionButton } from '@/@types/common'
import endpointConfig from '@/configs/endpoint.config'

export const actionButtons: ActionButton[] = [
    {
        label: 'Task List',
        icon: <TbPlaylistAdd className="text-xl" />,
        path: `${endpointConfig.works.tasks.task}`,
    },
]
