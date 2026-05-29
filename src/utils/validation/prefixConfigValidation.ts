import { apiValidatePrefixConfigValue } from '@/services/prefixConfigService'

export const validatePrefixRule = async (
    masterKey: string,
    value?: string | number | null,
) => {
    const normalizedValue = String(value ?? '').trim()

    if (!normalizedValue) {
        return []
    }

    try {
        const response = await apiValidatePrefixConfigValue({
            master_key: masterKey,
            value: normalizedValue,
        })

        return response.errors ?? []
    } catch (error: unknown) {
        const response = (
            error as { response?: { status?: number; data?: unknown } }
        ).response

        if (response?.status === 404) {
            return [
                'No prefix config is set for this master. Please create it first, then add this record.',
            ]
        }

        const data = response?.data as {
            errors?: string[] | Record<string, string[]>
        }

        if (Array.isArray(data?.errors)) {
            return data.errors
        }

        if (data?.errors && typeof data.errors === 'object') {
            return Object.values(data.errors).flat()
        }

        return ['Validation failed. Please check this value.']
    }
}
