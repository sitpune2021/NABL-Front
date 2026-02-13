import { useEffect, useState } from 'react'
import { apiGetLabMasterUnits } from '@/services/UnitService'
import { Unit } from '@/@types/unit'

const useLabUnits = (labId?: number) => {
    const [units, setUnits] = useState<Unit[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!labId) {
            setUnits([])
            return
        }

        setLoading(true)

        apiGetLabMasterUnits(labId)
            .then((res) => {
                const data = (res as { data: Unit[] }).data
                setUnits(data ?? [])
            })
            .catch(() => setUnits([]))
            .finally(() => setLoading(false))
    }, [labId])

    return { units, loading }
}

export default useLabUnits
