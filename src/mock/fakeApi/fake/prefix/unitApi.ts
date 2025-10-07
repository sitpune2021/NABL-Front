import { PrefixFormSchema } from '@/@types/common'
import { UNIT_PREFIX_KEY } from '@/constants/api.constant'
import { mock } from '@/mock/MockAdapter'

mock.onGet(`/api/unit-prefix`).reply(() => {
    const raw = localStorage.getItem(UNIT_PREFIX_KEY)

    const Data = raw ? (JSON.parse(raw) as PrefixFormSchema[]) : []
    const response = Data

    return [200, response]
})

mock.onPost('/api/unit-prefix').reply((config) => {
    const raw = localStorage.getItem(UNIT_PREFIX_KEY)
    const existing = raw ? (JSON.parse(raw) as PrefixFormSchema[]) : []

    const unitPrefix = JSON.parse(config.data)

    let updated: PrefixFormSchema[]

    const index = existing.findIndex((c) => c.id === unitPrefix.id)

    if (index > -1) {
        // Update existing
        existing[index] = { ...existing[index], ...unitPrefix }
        updated = [...existing]
    } else {
        // Add new
        unitPrefix.id = unitPrefix.id || Date.now()
        updated = [...existing, unitPrefix]
    }

    localStorage.setItem(UNIT_PREFIX_KEY, JSON.stringify(updated))

    return [200, { message: 'Prefix saved successfully' }]
})

mock.onGet(new RegExp('/api/unit-prefix/\\d+')).reply((config) => {
    const id = config.url?.split('/').pop()

    const raw = localStorage.getItem(UNIT_PREFIX_KEY)
    const unitPrefixs = raw ? (JSON.parse(raw) as PrefixFormSchema[]) : []

    const unitPrefix = unitPrefixs.find((d) => String(d.id) === id)

    if (unitPrefix) {
        return [200, unitPrefix]
    } else {
        return [404, { message: 'Prefix not found' }]
    }
})

mock.onPut(new RegExp('^/api/unit-prefix/\\d+$')).reply((config) => {
    const url = config.url || ''
    const id = url.split('/').pop()

    if (!id) {
        return [400, { message: 'Prefix ID is required' }]
    }

    const raw = localStorage.getItem(UNIT_PREFIX_KEY)
    const unitPrefix = raw ? (JSON.parse(raw) as PrefixFormSchema[]) : []

    const updatedany = JSON.parse(config.data)

    const index = unitPrefix.findIndex((c) => String(c.id) === id)

    if (index === -1) {
        return [404, { message: 'Prefix not found' }]
    }

    unitPrefix[index] = { ...unitPrefix[index], ...updatedany }

    localStorage.setItem(UNIT_PREFIX_KEY, JSON.stringify(unitPrefix))

    return [200, { message: 'Prefix updated successfully' }]
})
