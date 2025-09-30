import { PrefixFormSchema } from '@/@types/common'
import { CATEGORIES_PREFIX_KEY } from '@/constants/api.constant'
import { mock } from '@/mock/MockAdapter'

mock.onGet(`/api/category-prefix`).reply(() => {
    const raw = localStorage.getItem(CATEGORIES_PREFIX_KEY)

    const Data = raw ? (JSON.parse(raw) as PrefixFormSchema[]) : []
    const response = Data

    return [200, response]
})

mock.onPost('/api/category-prefix').reply((config) => {
    const raw = localStorage.getItem(CATEGORIES_PREFIX_KEY)
    const existing = raw ? (JSON.parse(raw) as PrefixFormSchema[]) : []

    const categoryPrefix = JSON.parse(config.data)

    let updated: PrefixFormSchema[]

    const index = existing.findIndex((c) => c.id === categoryPrefix.id)

    if (index > -1) {
        // Update existing
        existing[index] = { ...existing[index], ...categoryPrefix }
        updated = [...existing]
    } else {
        // Add new
        categoryPrefix.id = categoryPrefix.id || Date.now()
        updated = [...existing, categoryPrefix]
    }

    localStorage.setItem(CATEGORIES_PREFIX_KEY, JSON.stringify(updated))

    return [200, { message: 'Prefix saved successfully' }]
})

mock.onGet(new RegExp('/api/category-prefix/\\d+')).reply((config) => {
    const id = config.url?.split('/').pop()

    const raw = localStorage.getItem(CATEGORIES_PREFIX_KEY)
    const categoryPrefixs = raw ? (JSON.parse(raw) as PrefixFormSchema[]) : []

    const categoryPrefix = categoryPrefixs.find((d) => String(d.id) === id)

    if (categoryPrefix) {
        return [200, categoryPrefix]
    } else {
        return [404, { message: 'Prefix not found' }]
    }
})

mock.onPut(new RegExp('^/api/category-prefix/\\d+$')).reply((config) => {
    const url = config.url || ''
    const id = url.split('/').pop()

    if (!id) {
        return [400, { message: 'Prefix ID is required' }]
    }

    const raw = localStorage.getItem(CATEGORIES_PREFIX_KEY)
    const categoryPrefix = raw ? (JSON.parse(raw) as PrefixFormSchema[]) : []

    const updatedany = JSON.parse(config.data)

    const index = categoryPrefix.findIndex((c) => String(c.id) === id)

    if (index === -1) {
        return [404, { message: 'Prefix not found' }]
    }

    categoryPrefix[index] = { ...categoryPrefix[index], ...updatedany }

    localStorage.setItem(CATEGORIES_PREFIX_KEY, JSON.stringify(categoryPrefix))

    return [200, { message: 'Prefix updated successfully' }]
})
