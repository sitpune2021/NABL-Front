import { useMemo } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import endpointConfig from '@/configs/endpoint.config'
import useZoneList from '../../zone/List/hooks/useList'
import useClusterList from '../../cluster/List/hooks/useList'
import useLocationList from '../../location/List/hooks/useList'
import useDepartmentList from '../../department/List/hooks/useList'
import useInstrumentList from '../../instrument/List/hooks/useList'

import LabForm from '../Form'
import BottomPanel from '@/components/form/bottomPanel'
import { getMode } from '@/utils/getMode'
import { useDiscardConfirm } from '@/utils/hooks/useDiscardConfirm'
import { useEntityMutations } from '@/utils/hooks/useEntityMutations'
import { apiLab, apiUpdateLab } from '@/services/LabService'
import { useFormSubmit } from '@/utils/hoc/useFormSubmit'
import { useLabDetail } from '../List/hooks/useLabDetail'
import useLabList from '../List/hooks/useList'
import { LabFormSchema } from '@/schemas/lab.schema'
import { Lab } from '@/@types/lab'

const LabAddEdit = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { id } = useParams<{ id: string }>()
    const mode = useMemo(() => getMode(location.pathname), [location.pathname])
    const isView = mode === 'view'
    const isEdit = mode === 'edit'
    const discard = useDiscardConfirm()
    const { lab, isLoading } = useLabDetail(id)

    const { zoneList } = useZoneList()
    const { labList } = useLabList()
    const { clusterList } = useClusterList()
    const { locationList } = useLocationList()
    const { departmentList } = useDepartmentList()
    const { instrumentList } = useInstrumentList()

    const { handleSubmit, isSubmitting } = useFormSubmit<Lab>({
        apiCall: (values) =>
            save({ ...values, ...(isEdit && id ? { id } : {}) }),
        navigateTo: endpointConfig.client.lab.list,
    })

    const EMPTY_VALUES: LabFormSchema = {
        name: '',
        labType: '',
        labCode: !isSubmitting ? `LAB-${labList.length + 1}` : '',
        emails: [
            {
                type: 'eamil',
                value: '',
                label: 'primary',
                is_primary: true,
            },
        ],
        phones: [
            {
                type: 'phone',
                value: '',
                label: 'primary',
                is_primary: true,
            },
        ],
        address: '',
        location: [
            {
                zone_name: '',
                cluster_name: '',
                location_name: '',
                departments: [{ name: '', instruments: [] }],
                prefix: '',
                shortName: '',
                emails: [
                    {
                        type: 'eamil',
                        value: '',
                        label: 'primary',
                        is_primary: true,
                    },
                ],
                phones: [
                    {
                        type: 'phone',
                        value: '',
                        label: 'primary',
                        is_primary: true,
                    },
                ],
                address: '',
                instruments: [],
            },
        ],
    }

    const defaultValues = useMemo(() => lab ?? EMPTY_VALUES, [lab])

    const { save } = useEntityMutations<Lab>({
        apiCreate: apiLab,
        apiUpdate: apiUpdateLab,
    })

    const confirmDiscard = () => {
        toast.push(
            <Notification type="success">Changes discarded</Notification>,
            { placement: 'top-center' },
        )
        discard.close()
        navigate(`${endpointConfig.client.lab.list}`)
    }

    if (isLoading) {
        return <p className="p-4">Loading lab data...</p>
    }

    return (
        <>
            <LabForm
                defaultValues={defaultValues}
                readOnly={isView}
                zoneList={zoneList}
                clusterList={clusterList}
                locationList={locationList}
                departmentList={departmentList}
                instrumentList={instrumentList}
                onFormSubmit={handleSubmit}
            >
                <BottomPanel
                    isView={isView}
                    isSubmitting={isSubmitting}
                    isEdit={isEdit}
                    onDiscard={discard.show}
                />
            </LabForm>

            <ConfirmDialog
                isOpen={discard.open}
                type="danger"
                title="Discard changes"
                onClose={discard.close}
                onCancel={discard.close}
                onConfirm={confirmDiscard}
            >
                <p>
                    Are you sure you want to discard this? This action can’t be
                    undone.
                </p>
            </ConfirmDialog>
        </>
    )
}

export default LabAddEdit
