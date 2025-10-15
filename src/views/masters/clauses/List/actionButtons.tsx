import { TbTemplate } from 'react-icons/tb'
import { ActionButton } from '@/@types/common'
import endpointConfig from '@/configs/endpoint.config'

export const actionButtons: ActionButton[] = [
    {
        label: 'Add Clauses',
        icon: <TbTemplate className="text-xl" />,
        path: `${endpointConfig.master.clauses.create}`,
    },
    {
        label: 'Add Standards',
        icon: <TbTemplate className="text-xl" />,
        path: `${endpointConfig.master.clauses.standardCreate}`,
    },
]
