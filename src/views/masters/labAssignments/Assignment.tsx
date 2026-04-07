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
                locationLimit: labsAssignmentsList.lab_location_limit ?? 0,
                userLimit: labsAssignmentsList.user_limit ?? 0,
                labAssignment: {
                    assigned: labsAssignmentsList.lab_assignment.assigned ?? 0,
                    pending: labsAssignmentsList.lab_assignment.pending ?? 0,
                },
                locationAssignment: {
                    assigned:
                        labsAssignmentsList.location_assignment.assigned ?? 0,
                    pending:
                        labsAssignmentsList.location_assignment.pending ?? 0,
                },
                userAssignment: {
                    assigned: labsAssignmentsList.user_assignment.assigned ?? 0,
                    pending: labsAssignmentsList.user_assignment.pending ?? 0,
                },
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
