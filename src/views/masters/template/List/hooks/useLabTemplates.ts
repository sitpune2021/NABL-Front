import { useEffect, useState } from 'react'
import { apiGetLabMasterTemplates } from '@/services/TemplateService'
import { Template } from '@/@types/template'

const useLabTemplates = (labId?: number) => {
    const [templates, setTemplates] = useState<Template[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!labId) {
            setTemplates([])
            return
        }

        setLoading(true)

        apiGetLabMasterTemplates(labId)
            .then((res) => {
                const data = (res as { data: Template[] }).data
                setTemplates(data ?? [])
            })
            .catch(() => setTemplates([]))
            .finally(() => setLoading(false))
    }, [labId])

    return { templates, setTemplates, loading }
}

export default useLabTemplates
