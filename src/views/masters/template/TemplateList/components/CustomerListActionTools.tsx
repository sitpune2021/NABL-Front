import Button from '@/components/ui/Button'
import { MASTER_PREFIX_PATH } from '@/constants/route.constant'
import { TbTemplate } from 'react-icons/tb'
import { useNavigate } from 'react-router'

const CustomerListActionTools = () => {
    const navigate = useNavigate()

    return (
        <div className="flex flex-col md:flex-row gap-3">
            <Button
                variant="solid"
                icon={<TbTemplate className="text-xl" />}
                onClick={() =>
                    navigate(`${MASTER_PREFIX_PATH}/templates/create`)
                }
            >
                Add new Template
            </Button>
            <Button
                variant="solid"
                icon={<TbTemplate className="text-xl" />}
                onClick={() =>
                    navigate(`${MASTER_PREFIX_PATH}/templates/create`)
                }
            >
                Add new Header
            </Button>
            <Button
                variant="solid"
                icon={<TbTemplate className="text-xl" />}
                onClick={() =>
                    navigate(`${MASTER_PREFIX_PATH}/templates/create`)
                }
            >
                Add new Footer
            </Button>
        </div>
    )
}

export default CustomerListActionTools
