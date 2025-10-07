import { PrefixFormSchema } from '@/@types/common'
import { DEPARTMENTS_PREFIX_KEY } from '@/constants/api.constant'
import { mock } from '@/mock/MockAdapter'

mock.onGet(`/api/department-prefix`).reply(() => {
    const raw = localStorage.getItem(DEPARTMENTS_PREFIX_KEY)

    const Data = raw ? (JSON.parse(raw) as PrefixFormSchema[]) : []
    const response = Data

    return [200, response]
})

mock.onPost('/api/department-prefix').reply((config) => {
    const raw = localStorage.getItem(DEPARTMENTS_PREFIX_KEY)
    const existing = raw ? (JSON.parse(raw) as PrefixFormSchema[]) : []

    const departmentPrefix = JSON.parse(config.data)

    let updated: PrefixFormSchema[]

    const index = existing.findIndex((c) => c.id === departmentPrefix.id)

    if (index > -1) {
        // Update existing
        existing[index] = { ...existing[index], ...departmentPrefix }
        updated = [...existing]
    } else {
        // Add new
        departmentPrefix.id = departmentPrefix.id || Date.now()
        updated = [...existing, departmentPrefix]
    }

    localStorage.setItem(DEPARTMENTS_PREFIX_KEY, JSON.stringify(updated))

    return [200, { message: 'Prefix saved successfully' }]
})

mock.onGet(new RegExp('/api/department-prefix/\\d+')).reply((config) => {
    const id = config.url?.split('/').pop()

    const raw = localStorage.getItem(DEPARTMENTS_PREFIX_KEY)
    const departmentPrefixs = raw ? (JSON.parse(raw) as PrefixFormSchema[]) : []

    const departmentPrefix = departmentPrefixs.find((d) => String(d.id) === id)

    if (departmentPrefix) {
        return [200, departmentPrefix]
    } else {
        return [404, { message: 'Prefix not found' }]
    }
})

mock.onPut(new RegExp('^/api/department-prefix/\\d+$')).reply((config) => {
    const url = config.url || ''
    const id = url.split('/').pop()

    if (!id) {
        return [400, { message: 'Prefix ID is required' }]
    }

    const raw = localStorage.getItem(DEPARTMENTS_PREFIX_KEY)
    const departmentPrefix = raw ? (JSON.parse(raw) as PrefixFormSchema[]) : []

    const updatedany = JSON.parse(config.data)

    const index = departmentPrefix.findIndex((c) => String(c.id) === id)

    if (index === -1) {
        return [404, { message: 'Prefix not found' }]
    }

    departmentPrefix[index] = { ...departmentPrefix[index], ...updatedany }

    localStorage.setItem(
        DEPARTMENTS_PREFIX_KEY,
        JSON.stringify(departmentPrefix),
    )

    return [200, { message: 'Prefix updated successfully' }]
})
