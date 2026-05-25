import { useEffect, useRef, useState } from 'react'
import { apiGetPrefixList } from '@/services/prefixService'
import { usePrefixListStore } from '../store/listStore'

export const usePrefixList = () => {
    const [loading, setLoading] = useState(false)
    const fetched = useRef(false)

    const {
        tableData,
        selected,
        updateTable,
        toggleRow,
        setAll,
        clearSelection,
        prefixList,
        setPrefixList,
    } = usePrefixListStore()

    useEffect(() => {
        if (fetched.current) return
        fetched.current = true

        setLoading(true)

        apiGetPrefixList({})
            .then((res) => {
                console.log('DATA 👉', res)

                if (Array.isArray(res)) {
                    setPrefixList(res)
                } else if (Array.isArray(res?.data)) {
                    setPrefixList(res.data)
                } else {
                    setPrefixList([])
                }
            })
            .catch(() => setPrefixList([]))
            .finally(() => setLoading(false))
    }, [])

    return {
        prefixList,
        total: prefixList.length,
        tableData,
        updateTable,
        selected,
        toggleRow,
        setAll,
        clearSelection,
        isLoading: loading,
    }
}
