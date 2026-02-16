import { useEffect, useState } from 'react'
import { apiGetLabMasterCategories } from '@/services/CategoriesService'
import { Category } from '@/@types/category'

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
                const data = (res as { data: Category[] }).data
                setCategories(data ?? [])
            })
            .catch(() => setCategories([]))
            .finally(() => setLoading(false))
    }, [labId])

    return { categories, setCategories, loading }
}

export default useLabCategories
