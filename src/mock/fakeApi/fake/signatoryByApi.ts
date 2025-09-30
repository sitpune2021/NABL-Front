// signatoryBy

import { SignatoryBy } from '@/@types/signatoryBy'
import { SIGNATORYBY_KEY } from '@/constants/api.constant'
import { mock } from '@/mock/MockAdapter'

mock.onGet(`/api/signatoryBy`).reply(() => {
    const raw = localStorage.getItem(SIGNATORYBY_KEY)
    const Data = raw ? (JSON.parse(raw) as SignatoryBy[]) : []
    const response = {
        list: Data,
        total: Data.length,
    }

    return [200, response]
})

mock.onPost('/api/signatoryBy').reply((config) => {
    const raw = localStorage.getItem(SIGNATORYBY_KEY)
    const existing = raw ? (JSON.parse(raw) as SignatoryBy[]) : []

    const signatoryBy = JSON.parse(config.data)

    let updated: SignatoryBy[]

    const index = existing.findIndex((c) => c.id === signatoryBy.id)

    if (index > -1) {
        // Update existing
        existing[index] = { ...existing[index], ...signatoryBy }
        updated = [...existing]
    } else {
        // Add new
        signatoryBy.id = signatoryBy.id || Date.now()
        updated = [...existing, signatoryBy]
    }

    localStorage.setItem(SIGNATORYBY_KEY, JSON.stringify(updated))

    return [200, { message: 'SignatoryBy saved successfully' }]
})

mock.onGet(new RegExp('/api/signatoryBy/\\d+')).reply((config) => {
    const id = config.url?.split('/').pop()

    const raw = localStorage.getItem(SIGNATORYBY_KEY)
    const signatoryBys = raw ? (JSON.parse(raw) as SignatoryBy[]) : []

    const signatoryBy = signatoryBys.find((d) => String(d.id) === id)

    if (signatoryBy) {
        return [200, signatoryBy]
    } else {
        return [404, { message: 'SignatoryBy not found' }]
    }
})

mock.onPut(new RegExp('^/api/signatoryBy/\\d+$')).reply((config) => {
    const url = config.url || ''
    const id = url.split('/').pop()

    if (!id) {
        return [400, { message: 'SignatoryBy ID is required' }]
    }

    const raw = localStorage.getItem(SIGNATORYBY_KEY)
    const signatoryBy = raw ? (JSON.parse(raw) as SignatoryBy[]) : []

    const updatedSignatoryBy = JSON.parse(config.data)

    const index = signatoryBy.findIndex((c) => String(c.id) === id)

    if (index === -1) {
        return [404, { message: 'SignatoryBy not found' }]
    }

    // Update the signatoryBy at found index
    signatoryBy[index] = { ...signatoryBy[index], ...updatedSignatoryBy }

    localStorage.setItem(SIGNATORYBY_KEY, JSON.stringify(signatoryBy))

    return [200, { message: 'SignatoryBy updated successfully' }]
})
