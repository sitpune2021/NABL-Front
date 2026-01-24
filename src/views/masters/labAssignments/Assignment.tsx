import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import AssignmentBody from './components/AssignmentBody'
import LabLocationAssignmentSection from './components/LabLocationAssignmentSection'
import { useAssignmentStore } from './store/assignmentStore'
import useLabList from '../lab/List/hooks/useList'
import useLocationList from '../location/List/hooks/useList'
import useUserList from '../user/List/hooks/useList'

const Assignment = () => {
    const { control, setValue } = useForm({
        defaultValues: {
            labAssignments: {},
        },
    })

    const { setLabs, setLocations, setUsers } = useAssignmentStore()

    const { labList } = useLabList()
    const { locationList } = useLocationList()
    const { userList } = useUserList()

    useEffect(() => {
        if (labList?.length) setLabs(labList)
    }, [labList?.length, setLabs])

    useEffect(() => {
        if (locationList?.length) setLocations(locationList)
    }, [locationList?.length, setLocations])

    useEffect(() => {
        if (userList?.length) setUsers(userList)
    }, [userList?.length, setUsers])

    return (
        <>
            <AdaptiveCard className="mb-6">
                <div className="p-4">
                    <AssignmentBody />
                </div>
            </AdaptiveCard>

            <AdaptiveCard>
                <div className="p-4">
                    <LabLocationAssignmentSection
                        control={control}
                        setValue={setValue}
                        readOnly={false}
                    />
                </div>
            </AdaptiveCard>
        </>
    )
}

export default Assignment
