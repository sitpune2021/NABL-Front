import { useEffect, useState } from 'react'
import { apiGetLabMasterCategories } from '@/services/CategoriesService'

interface Category {
    id: number
    name: string
}

const useLabCategories = (labId?: number) => {
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!labId) {
            setCategories([])
            return
        }

        setLoading(true)

        apiGetLabMasterCategories(labId)
            .then((res) => {
                setCategories(res.data ?? [])
            })
            .catch(() => setCategories([]))
            .finally(() => setLoading(false))
    }, [labId])

    return { categories, loading }
}

export default useLabCategories
