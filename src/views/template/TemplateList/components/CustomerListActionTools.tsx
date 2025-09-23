import Button from '@/components/ui/Button'
import { TbTemplate } from 'react-icons/tb'
import { useNavigate } from 'react-router'

const CustomerListActionTools = () => {
    const navigate = useNavigate()

    return (
        <div className="flex flex-col md:flex-row gap-3">
            <Button
                variant="solid"
                icon={<TbTemplate className="text-xl" />}
                onClick={() => navigate('/master/template/template-create')}
            >
                Add new Template
            </Button>
            <Button
                variant="solid"
                icon={<TbTemplate className="text-xl" />}
                onClick={() => navigate('/master/template/template-create')}
            >
                Add new Header
            </Button>
            <Button
                variant="solid"
                icon={<TbTemplate className="text-xl" />}
                onClick={() => navigate('/master/template/template-create')}
            >
                Add new Footer
            </Button>
        </div>
    )
}

export default CustomerListActionTools
