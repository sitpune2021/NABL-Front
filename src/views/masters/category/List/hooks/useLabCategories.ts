import { useEffect, useState } from 'react'
import {
    apiGetLabMasterCategories,
    apiGetLabAllCategories,
} from '@/services/CategoriesService'
import { Category } from '@/@types/category'

type Mode = 'master' | 'all'

const useLabCategories = (labId?: number, mode: Mode = 'master') => {
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!labId) {
            setCategories([])
            return
        }

        setLoading(true)

        const api =
            mode === 'all' ? apiGetLabAllCategories : apiGetLabMasterCategories

        api(labId)
            .then((res) => {
                setCategories(res.data ?? [])
            })
            .catch(() => setCategories([]))
            .finally(() => setLoading(false))
    }, [labId, mode])

    return { categories, setCategories, loading }
}

export default useLabCategories
