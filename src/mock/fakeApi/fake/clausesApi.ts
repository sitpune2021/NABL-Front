import { Clauses } from '@/@types/clauses'
import { CLAUSES_KEY } from '@/constants/api.constant'
import { mock } from '@/mock/MockAdapter'

mock.onGet(`/api/clauses`).reply(() => {
    const raw = localStorage.getItem(CLAUSES_KEY)
    const Data = raw ? (JSON.parse(raw) as Clauses[]) : []
    const response = {
        list: Data,
        total: Data.length,
    }

    return [200, response]
})

mock.onPost('/api/clauses').reply((config) => {
    const raw = localStorage.getItem(CLAUSES_KEY)
    const existing = raw ? (JSON.parse(raw) as Clauses[]) : []

    const clauses = JSON.parse(config.data)

    let updated: Clauses[]

    const index = existing.findIndex((c) => c.id === clauses.id)

    if (index > -1) {
        // Update existing
        existing[index] = { ...existing[index], ...clauses }
        updated = [...existing]
    } else {
        // Add new
        clauses.id = clauses.id || Date.now()
        updated = [...existing, clauses]
    }

    localStorage.setItem(CLAUSES_KEY, JSON.stringify(updated))

    return [200, { message: 'Clauses saved successfully' }]
})

mock.onGet(new RegExp('/api/clauses/\\d+')).reply((config) => {
    const id = config.url?.split('/').pop()

    const raw = localStorage.getItem(CLAUSES_KEY)
    const clausess = raw ? (JSON.parse(raw) as Clauses[]) : []

    const clauses = clausess.find((d) => String(d.id) === id)

    if (clauses) {
        return [200, clauses]
    } else {
        return [404, { message: 'Clauses not found' }]
    }
})

mock.onPut(new RegExp('^/api/clauses/\\d+$')).reply((config) => {
    const url = config.url || ''
    const id = url.split('/').pop()

    if (!id) {
        return [400, { message: 'Clauses ID is required' }]
    }

    const raw = localStorage.getItem(CLAUSES_KEY)
    const clauses = raw ? (JSON.parse(raw) as Clauses[]) : []

    const updatedClauses = JSON.parse(config.data)

    const index = clauses.findIndex((c) => String(c.id) === id)

    if (index === -1) {
        return [404, { message: 'Clauses not found' }]
    }

    // Update the clauses at found index
    clauses[index] = { ...clauses[index], ...updatedClauses }

    localStorage.setItem(CLAUSES_KEY, JSON.stringify(clauses))

    return [200, { message: 'Clauses updated successfully' }]
})
