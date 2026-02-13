import { useEffect, useState } from 'react'
import { apiGetLabSubCategories } from '@/services/SubCategoryService'
import { SubCategory } from '@/@types/subcategory'

const useLabSubCategories = (labId?: number, categoryId?: number) => {
    const [subCategories, setSubCategories] = useState<SubCategory[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!labId || !categoryId) {
            setSubCategories([])
            return
        }

        console.log('CALLING API WITH', labId, categoryId)

        setLoading(true)

        apiGetLabSubCategories(labId, categoryId)
            .then((res) => {
                setSubCategories(
                    Array.isArray(res.data) ? res.data : (res.data.data ?? []),
                )
            })
            .catch(() => setSubCategories([]))
            .finally(() => setLoading(false))
    }, [labId, categoryId])

    return { subCategories, loading }
}

export default useLabSubCategories
