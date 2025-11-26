import { TbCloudDownload, TbTemplate } from 'react-icons/tb'
import { ActionButton } from '@/@types/common'
import endpointConfig from '@/configs/endpoint.config'

export const actionButtons = (handleDownload: () => void): ActionButton[] => [
    {
        label: 'Add Document',
        icon: <TbTemplate className="text-xl" />,
        path: `${endpointConfig.master.document.create}`,
    },
    {
        label: 'Download',
        icon: <TbCloudDownload className="text-xl" />,
        action: handleDownload,
        path: '',
    },
]
