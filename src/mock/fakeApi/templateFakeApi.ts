import { mock } from '../MockAdapter'
import { CATEGORIES_KEY } from '@/constants/api.constant'

interface Category {
    id: string
    name: string
}

mock.onGet(`/api/category`).reply(() => {
    const raw = localStorage.getItem(CATEGORIES_KEY)
    const Data = raw ? (JSON.parse(raw) as Category[]) : []
    const response = {
        list: Data,
        total: Data.length,
    }

    return [200, response]
})

mock.onPost('/api/category').reply((config) => {
    const raw = localStorage.getItem(CATEGORIES_KEY)
    const existing = raw ? (JSON.parse(raw) as Category[]) : []

    const category = JSON.parse(config.data)

    let updated: Category[]

    const index = existing.findIndex((c) => c.id === category.id)

    if (index > -1) {
        // Update existing
        existing[index] = { ...existing[index], ...category }
        updated = [...existing]
    } else {
        // Add new
        category.id = category.id || Date.now()
        updated = [...existing, category]
    }

    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(updated))

    return [200, { message: 'Category saved successfully' }]
})
