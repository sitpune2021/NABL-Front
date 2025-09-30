import { SignatoryOn } from '@/@types/signatoryOn'
import { SIGNATORYON_KEY } from '@/constants/api.constant'
import { mock } from '@/mock/MockAdapter'

// signatoryOn
mock.onGet(`/api/signatoryOn`).reply(() => {
    const raw = localStorage.getItem(SIGNATORYON_KEY)
    const Data = raw ? (JSON.parse(raw) as SignatoryOn[]) : []
    const response = {
        list: Data,
        total: Data.length,
    }

    return [200, response]
})

mock.onPost('/api/signatoryOn').reply((config) => {
    const raw = localStorage.getItem(SIGNATORYON_KEY)
    const existing = raw ? (JSON.parse(raw) as SignatoryOn[]) : []

    const signatoryOn = JSON.parse(config.data)

    let updated: SignatoryOn[]

    const index = existing.findIndex((c) => c.id === signatoryOn.id)

    if (index > -1) {
        // Update existing
        existing[index] = { ...existing[index], ...signatoryOn }
        updated = [...existing]
    } else {
        // Add new
        signatoryOn.id = signatoryOn.id || Date.now()
        updated = [...existing, signatoryOn]
    }

    localStorage.setItem(SIGNATORYON_KEY, JSON.stringify(updated))

    return [200, { message: 'SignatoryOn saved successfully' }]
})

mock.onGet(new RegExp('/api/signatoryOn/\\d+')).reply((config) => {
    const id = config.url?.split('/').pop()

    const raw = localStorage.getItem(SIGNATORYON_KEY)
    const signatoryOns = raw ? (JSON.parse(raw) as SignatoryOn[]) : []

    const signatoryOn = signatoryOns.find((d) => String(d.id) === id)

    if (signatoryOn) {
        return [200, signatoryOn]
    } else {
        return [404, { message: 'SignatoryOn not found' }]
    }
})

mock.onPut(new RegExp('^/api/signatoryOn/\\d+$')).reply((config) => {
    const url = config.url || ''
    const id = url.split('/').pop()

    if (!id) {
        return [400, { message: 'SignatoryOn ID is required' }]
    }

    const raw = localStorage.getItem(SIGNATORYON_KEY)
    const signatoryOn = raw ? (JSON.parse(raw) as SignatoryOn[]) : []

    const updatedSignatoryOn = JSON.parse(config.data)

    const index = signatoryOn.findIndex((c) => String(c.id) === id)

    if (index === -1) {
        return [404, { message: 'SignatoryOn not found' }]
    }

    // Update the signatoryOn at found index
    signatoryOn[index] = { ...signatoryOn[index], ...updatedSignatoryOn }

    localStorage.setItem(SIGNATORYON_KEY, JSON.stringify(signatoryOn))

    return [200, { message: 'SignatoryOn updated successfully' }]
})
