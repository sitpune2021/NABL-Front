import Button from '@/components/ui/Button'
import { MASTER_PREFIX_PATH } from '@/constants/route.constant'
import { TbBorderBottomPlus } from 'react-icons/tb'
import { useNavigate } from 'react-router'

const CustomerListActionTools = () => {
    const navigate = useNavigate()

    return (
        <div className="flex flex-col md:flex-row gap-3">
            <Button
                variant="solid"
                icon={<TbBorderBottomPlus className="text-xl" />}
                onClick={() =>
                    navigate(`${MASTER_PREFIX_PATH}/category/create`)
                }
            >
                Add new Category
            </Button>
        </div>
    )
}

export default CustomerListActionTools
