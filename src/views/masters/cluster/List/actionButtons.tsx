import { TbTemplate } from 'react-icons/tb'
import { ActionButton } from '@/@types/common'
import endpointConfig from '@/configs/endpoint.config'

export const actionButtons: ActionButton[] = [
    {
        label: 'Add new Cluster',
        icon: <TbTemplate className="text-xl" />,
        path: `${endpointConfig.master.cluster.create}`,
    },
]
