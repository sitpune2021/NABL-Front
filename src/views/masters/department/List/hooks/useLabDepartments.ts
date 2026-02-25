import { useEffect, useState } from 'react'
import { apiGetLabMasterDepartments } from '@/services/DepartmentService'
import { Department } from '@/@types/department'

const useLabDepartments = (labId?: number) => {
    const [departments, setDepartments] = useState<Department[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!labId) {
            setDepartments([])
            return
        }

        setLoading(true)

        apiGetLabMasterDepartments(labId)
            .then((res) => {
                const data = (res as { data: Department[] }).data
                setDepartments(data ?? [])
            })
            .catch(() => setDepartments([]))
            .finally(() => setLoading(false))
    }, [labId])

    return { departments, setDepartments, loading }
}

export default useLabDepartments
