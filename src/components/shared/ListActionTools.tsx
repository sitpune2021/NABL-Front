import { ListActionToolsProps } from '@/@types/common'
import Button from '@/components/ui/Button'
import { useNavigate } from 'react-router'

const ListActionTools = ({ buttons }: ListActionToolsProps) => {
    const navigate = useNavigate()

    return (
        <div className="flex flex-col md:flex-row gap-3">
            {buttons.map((btn, index) => (
                <Button
                    key={index}
                    variant="solid"
                    icon={btn.icon}
                    onClick={() => navigate(btn.path)}
                >
                    {btn.label}
                </Button>
            ))}
        </div>
    )
}

export default ListActionTools
