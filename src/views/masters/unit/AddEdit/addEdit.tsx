import { useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import sleep from '@/utils/sleep'
import endpointConfig from '@/configs/endpoint.config'
import useUnitList from '../List/hooks/useList'
import UnitForm from '../Form'
import { UnitFormSchema } from '@/@types/unit'
import BottomPanel from '@/components/form/bottomPanel'

const UnitAddEdit = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { id: unitId } = useParams()
    const { saveUnitData, getUnitById, unitList } = useUnitList()
    const [discardConfirmationOpen, setDiscardConfirmationOpen] =
        useState(false)
    const [isSubmiting, setIsSubmiting] = useState(false)
    const [unitData, setUnitData] = useState<UnitFormSchema | null>(null)
    const [loadingData, setLoadingData] = useState(false)

    const isEdit = location.pathname.includes('/edit')
    const isView = location.pathname.includes('/view')
    const isAdd = location.pathname.includes('/create')

    const existingUnitNames = unitList
        .filter((unit) => !isEdit || unit.id !== unitId)
        .map((unit) => unit.name)

    useEffect(() => {
        if (!isAdd && unitId) {
            setLoadingData(true)
            getUnitById(unitId)
                .then((data) => {
                    setUnitData(data)
                })
                .finally(() => setLoadingData(false))
        }
    }, [unitId, isAdd])

    const handleFormSubmit = async (values: UnitFormSchema) => {
        if (isView) return
        setIsSubmiting(true)
        const payload = isEdit ? { ...values, id: unitId } : values
        await saveUnitData(payload)
        await sleep(800)
        setIsSubmiting(false)
        toast.push(
            <Notification type="success">
                {isEdit ? 'Unit updated!' : 'Unit created!'}
            </Notification>,
            { placement: 'top-center' },
        )
        navigate(`${endpointConfig.setting.unit.list}`)
    }

    const handleConfirmDiscard = () => {
        setDiscardConfirmationOpen(true)
        toast.push(
            <Notification type="success">Changes discarded!</Notification>,
            { placement: 'top-center' },
        )
        navigate(`${endpointConfig.setting.unit.list}`)
    }

    const handleDiscard = () => setDiscardConfirmationOpen(true)
    const handleCancel = () => setDiscardConfirmationOpen(false)

    if (loadingData && !isAdd) {
        return <p className="p-4">Loading unit data...</p>
    }

    return (
        <>
            <UnitForm
                newUnit={isAdd}
                defaultValues={unitData ?? { name: '' }}
                readOnly={isView}
                existingUnits={existingUnitNames}
                onFormSubmit={handleFormSubmit}
            >
                <BottomPanel
                    isView={isView}
                    isSubmitting={isSubmiting}
                    isEdit={isEdit}
                    onDiscard={handleDiscard}
                />
            </UnitForm>
            <ConfirmDialog
                isOpen={discardConfirmationOpen}
                type="danger"
                title="Discard changes"
                onClose={handleCancel}
                onRequestClose={handleCancel}
                onCancel={handleCancel}
                onConfirm={handleConfirmDiscard}
            >
                <p>
                    Are you sure you want discard this? This action can&apos;t
                    be undo.{' '}
                </p>
            </ConfirmDialog>
        </>
    )
}

export default UnitAddEdit
