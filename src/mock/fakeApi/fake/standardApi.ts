import { Standard } from '@/@types/standard'
import { STANDARD_KEY } from '@/constants/api.constant'
import { mock } from '@/mock/MockAdapter'

// GET all standards
mock.onGet('/api/standard').reply(() => {
    const raw = localStorage.getItem(STANDARD_KEY)
    const data = raw ? (JSON.parse(raw) as Standard[]) : []
    const response = {
        list: data,
        total: data.length,
    }
    return [200, response]
})

// POST create new standard - FIXED ENDPOINT
mock.onPost('/api/standard').reply((config) => {
    const raw = localStorage.getItem(STANDARD_KEY)
    const existing = raw ? (JSON.parse(raw) as Standard[]) : []

    const standard = JSON.parse(config.data)

    let updated: Standard[]

    const index = existing.findIndex((c) => c.id === standard.id)

    if (index > -1) {
        // Update existing
        existing[index] = { ...existing[index], ...standard }
        updated = [...existing]
    } else {
        // Add new
        standard.id = standard.id || `STD_${Date.now()}`
        updated = [...existing, standard]
    }

    localStorage.setItem(STANDARD_KEY, JSON.stringify(updated))

    return [200, { message: 'Standard saved successfully', data: standard }]
})

// GET single standard by ID - FIXED REGEX
mock.onGet(new RegExp('/api/standard/.+')).reply((config) => {
    const id = config.url?.split('/').pop()

    const raw = localStorage.getItem(STANDARD_KEY)
    const standards = raw ? (JSON.parse(raw) as Standard[]) : []

    const standard = standards.find((d) => String(d.id) === id)

    if (standard) {
        return [200, standard]
    } else {
        return [404, { message: 'Standard not found' }]
    }
})

// PUT update standard - FIXED REGEX
mock.onPut(new RegExp('^/api/standard/.+$')).reply((config) => {
    const url = config.url || ''
    const id = url.split('/').pop()

    if (!id) {
        return [400, { message: 'Standard ID is required' }]
    }

    const raw = localStorage.getItem(STANDARD_KEY)
    const standards = raw ? (JSON.parse(raw) as Standard[]) : []

    const updatedStandard = JSON.parse(config.data)

    const index = standards.findIndex((c) => String(c.id) === id)

    if (index === -1) {
        return [404, { message: 'Standard not found' }]
    }

    // Update the standard at found index
    standards[index] = { ...standards[index], ...updatedStandard }

    localStorage.setItem(STANDARD_KEY, JSON.stringify(standards))

    return [200, { message: 'Standard updated successfully' }]
})

// DELETE standard
mock.onDelete(new RegExp('^/api/standard/.+$')).reply((config) => {
    const url = config.url || ''
    const id = url.split('/').pop()

    if (!id) {
        return [400, { message: 'Standard ID is required' }]
    }

    const raw = localStorage.getItem(STANDARD_KEY)
    const standards = raw ? (JSON.parse(raw) as Standard[]) : []

    const filteredStandards = standards.filter((c) => String(c.id) !== id)

    localStorage.setItem(STANDARD_KEY, JSON.stringify(filteredStandards))

    return [200, { message: 'Standard deleted successfully' }]
})
