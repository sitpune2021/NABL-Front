/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'

type SyncConfig = {
    mutate: () => void
    appendApi: (id: number, force?: boolean) => Promise<any>
    onDependencyConfirm?: () => Promise<boolean>
}

const useSync = ({ mutate, appendApi, onDependencyConfirm }: SyncConfig) => {
    const [submitting, setSubmitting] = useState(false)

    const applySync = async (ids: number[]) => {
        if (!ids.length) return

        setSubmitting(true)

        let successCount = 0
        let dependencyHandled = false

        for (const id of ids) {
            try {
                await appendApi(id)
                successCount++
            } catch (error: any) {
                const response = error?.response?.data

                if (response?.needs_category_append && onDependencyConfirm) {
                    // 🔥 Ask only once
                    if (!dependencyHandled) {
                        const confirmed = await onDependencyConfirm()

                        if (!confirmed) continue

                        dependencyHandled = true
                    }

                    await appendApi(id, true)
                    successCount++
                } else {
                    console.error('Sync failed for ID:', id)
                }
            }
        }

        if (successCount > 0) {
            mutate()
        }

        setSubmitting(false)
    }

    return {
        submitting,
        applySync,
    }
}

export default useSync
