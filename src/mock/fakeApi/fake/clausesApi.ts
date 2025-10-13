import { Clauses } from '@/@types/clauses'
import { CLAUSES_KEY } from '@/constants/api.constant'
import { mock } from '@/mock/MockAdapter'

// Get all clauses from localStorage
mock.onGet(new RegExp('^/api/clauses/\\d+$')).reply((config) => {
    const id = config.url?.split('/').pop()
    const raw = localStorage.getItem(CLAUSES_KEY)
    const clauses = raw ? (JSON.parse(raw) as Clauses[]) : []

    const clause = clauses.find((c) => String(c.id) === id)

    if (!clause) {
        return [404, { message: 'Clause not found' }]
    }

    if (!clause.name) {
        const createdYear = new Date(clause.created_at).getFullYear()
        const nextYear = createdYear + 1
        clause.name = `ISO-STANDARD-${createdYear}-${nextYear.toString().slice(-2)}`
    }

    return [200, clause]
})

// Create new clause

mock.onPost('/api/clauses').reply((config) => {
    const raw = localStorage.getItem(CLAUSES_KEY)
    const existing = raw ? (JSON.parse(raw) as Clauses[]) : []

    const newClause = JSON.parse(config.data)
    newClause.id = newClause.id || Date.now().toString()
    newClause.status = 'active'
    newClause.created_at = new Date().toISOString()

    // Generate name in format "ISO-STANDARD-YYYY-YY"
    const currentYear = new Date().getFullYear()
    const nextYear = currentYear + 1
    newClause.name = `ISO-STANDARD-${currentYear}-${nextYear.toString().slice(-2)}`

    // Deactivate all other clauses
    const updated = existing.map((clause) => ({
        ...clause,
        status: 'inactive',
    }))

    updated.push(newClause)
    localStorage.setItem(CLAUSES_KEY, JSON.stringify(updated))

    return [200, { message: 'Clauses saved successfully' }]
})

// Get clause by ID
mock.onGet('/api/clauses').reply(() => {
    const raw = localStorage.getItem(CLAUSES_KEY)
    let data = raw ? (JSON.parse(raw) as Clauses[]) : []

    // Add name if missing for existing data
    data = data.map((clause) => {
        if (!clause.name) {
            const createdYear = new Date(clause.created_at).getFullYear()
            const nextYear = createdYear + 1
            return {
                ...clause,
                name: `ISO-STANDARD-${createdYear}-${nextYear.toString().slice(-2)}`,
            }
        }
        return clause
    })

    data = data.sort((a, b) => {
        if (a.status === 'active' && b.status !== 'active') return -1
        if (a.status !== 'active' && b.status === 'active') return 1
        return Number(b.id) - Number(a.id)
    })

    const response = {
        list: data,
        total: data.length,
    }
    return [200, response]
})

// Update clause
mock.onPut(new RegExp('^/api/clauses/\\d+$')).reply((config) => {
    const id = config.url?.split('/').pop()
    const raw = localStorage.getItem(CLAUSES_KEY)
    const clauses = raw ? (JSON.parse(raw) as Clauses[]) : []

    const updatedData = JSON.parse(config.data)

    // If activating a clause, deactivate others
    if (updatedData.status === 'active') {
        clauses.forEach((clause) => {
            clause.status = 'inactive'
        })
    }

    const index = clauses.findIndex((c) => String(c.id) === id)
    if (index === -1) {
        return [404, { message: 'Clauses not found' }]
    }

    clauses[index] = { ...clauses[index], ...updatedData }
    localStorage.setItem(CLAUSES_KEY, JSON.stringify(clauses))

    return [200, { message: 'Clauses updated successfully' }]
})
