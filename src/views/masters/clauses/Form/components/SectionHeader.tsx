/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui'
import { HiPlus } from 'react-icons/hi'

const SectionHeader = ({ title, onAdd, disabled }: any) => (
    <div className="flex justify-between items-center mb-4">
        <h5 className="font-semibold">{title}</h5>
        <Button size="sm" type="button" disabled={disabled} onClick={onAdd}>
            <HiPlus className="text-lg" />
        </Button>
    </div>
)

export default SectionHeader
