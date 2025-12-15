/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
// import sleep from '@/utils/sleep'
import endpointConfig from '@/configs/endpoint.config'
import useLabList from '../List/hooks/useList'
import useZoneList from '../../zone/List/hooks/useList'
import useClusterList from '../../cluster/List/hooks/useList'
import useLocationList from '../../location/List/hooks/useList'
import useDepartmentList from '../../department/List/hooks/useList'
import useInstrumentList from '../../instrument/List/hooks/useList'

import LabForm from '../Form'
import type { Lab, LabFormSchema } from '@/@types/lab'
import BottomPanel from '@/components/form/bottomPanel'

const LabAddEdit = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { id: labId } = useParams()
    const { saveLabData, getLabById, labList } = useLabList()

    const { zoneList } = useZoneList()
    const { clusterList } = useClusterList()
    const { locationList } = useLocationList()
    const { departmentList } = useDepartmentList()
    const { instrumentList } = useInstrumentList()
    const [discardConfirmationOpen, setDiscardConfirmationOpen] =
        useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [labData, setLabData] = useState<Lab | null>(null)
    const [loadingData, setLoadingData] = useState(false)

    const mode = useMemo(() => {
        if (location.pathname.includes('/create')) return 'add'
        if (location.pathname.includes('/edit')) return 'edit'
        if (location.pathname.includes('/view')) return 'view'
        return 'add'
    }, [location.pathname])

    const isAdd = mode === 'add'
    const isEdit = mode === 'edit'
    const isView = mode === 'view'

    useEffect(() => {
        if (isAdd || !labId) return

        let isMounted = true
        setLoadingData(true)

        getLabById(labId)
            .then((data) => {
                if (isMounted) setLabData(data)
            })
            .finally(() => {
                if (isMounted) setLoadingData(false)
            })

        return () => {
            isMounted = false
        }
    }, [labId, isAdd, getLabById])

    const handleFormSubmit = async (values: LabFormSchema) => {
        if (isView) return

        setIsSubmitting(true)
        try {
            const payload = isEdit ? { ...values, id: labId } : values
            await saveLabData(payload)

            toast.push(
                <Notification type="success">
                    {isEdit ? 'Lab updated!' : 'Lab created!'}
                </Notification>,
                { placement: 'top-center' },
            )

            navigate(endpointConfig.master.lab.list)
        } catch (error: any) {
            const backendErrors = error?.response?.data?.errors
            if (backendErrors) {
                Object.entries(backendErrors).forEach(([messages]) => {
                    const message = Array.isArray(messages)
                        ? messages[0]
                        : messages
                    toast.push(
                        <Notification type="danger">{message}</Notification>,
                        { placement: 'top-center' },
                    )
                })
            } else {
                const errorMessage =
                    error?.response?.data?.message ||
                    `Failed to ${isEdit ? 'update' : 'create'}department`
                toast.push(
                    <Notification type="danger">{errorMessage}</Notification>,
                    { placement: 'top-center' },
                )
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDiscard = () => setDiscardConfirmationOpen(true)
    const handleCancel = () => setDiscardConfirmationOpen(false)

    const handleConfirmDiscard = () => {
        setDiscardConfirmationOpen(false)
        toast.push(
            <Notification type="success">Changes discarded!</Notification>,
            { placement: 'top-center' },
        )
        navigate(endpointConfig.master.lab.list)
    }

    if (loadingData && !isAdd) {
        return <p className="p-4">Loading lab data...</p>
    }

    const defaultFormValues: any = useMemo(
        () =>
            labData ?? {
                name: '',
                labType: '',
                department: [],
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
                            { value: '', label: 'primary', is_primary: true },
                        ],
                        phones: [
                            { value: '', label: 'primary', is_primary: true },
                        ],
                        address: '',
                        instruments: [],
                    },
                ],
            },
        [labData, labList.length, isSubmitting],
    )

    return (
        <>
            <LabForm
                newLab={isAdd}
                defaultValues={defaultFormValues}
                readOnly={isView}
                zoneList={zoneList}
                clusterList={clusterList}
                locationList={locationList}
                departmentList={departmentList}
                instrumentList={instrumentList}
                onFormSubmit={handleFormSubmit}
            >
                <BottomPanel
                    isView={isView}
                    isSubmitting={isSubmitting}
                    isEdit={isEdit}
                    onDiscard={handleDiscard}
                />
            </LabForm>

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
                    Are you sure you want to discard this? This action can’t be
                    undone.
                </p>
            </ConfirmDialog>
        </>
    )
}

export default LabAddEdit
