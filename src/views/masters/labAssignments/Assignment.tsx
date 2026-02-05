import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import AssignmentBody from './components/AssignmentBody'
import LabLocationAssignmentSection from './components/LabLocationAssignmentSection'
import { useAssignmentStore } from './store/assignmentStore'
import { useLabsAssignmentsList } from './hooks/useList'

const Assignment = () => {
    const form = useForm({
        defaultValues: {
            labAssignments: {},
        },
    })

    const { setStats } = useAssignmentStore()

    const { labsAssignmentsList, isLoading } = useLabsAssignmentsList()

    useEffect(() => {
        if (!isLoading && labsAssignmentsList) {
            setStats({
                labCount: labsAssignmentsList.lab_count ?? 0,
                locationCount: labsAssignmentsList.lab_location_count ?? 0,
                userCount: labsAssignmentsList.user_count ?? 0,
            })
        }
    }, [isLoading, labsAssignmentsList, setStats])

    return (
        <>
            <AdaptiveCard className="mb-6">
                <div className="p-4">
                    <AssignmentBody />
                </div>
            </AdaptiveCard>

            <AdaptiveCard>
                <div className="p-4">
                    <LabLocationAssignmentSection {...form} />
                </div>
            </AdaptiveCard>
        </>
    )
}

export default Assignment
