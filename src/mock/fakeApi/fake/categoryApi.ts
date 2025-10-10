import { Category } from '@/@types/category'
import { CATEGORIES_KEY } from '@/constants/api.constant'
import { mock } from '@/mock/MockAdapter'

mock.onGet(`/api/category`).reply(() => {
    const raw = localStorage.getItem(CATEGORIES_KEY)
    const Data = raw ? (JSON.parse(raw) as Category[]) : []
    const response = {
        data: Data,
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

mock.onGet(new RegExp('/api/category/\\d+')).reply((config) => {
    const id = config.url?.split('/').pop()

    const raw = localStorage.getItem(CATEGORIES_KEY)
    const categories = raw ? (JSON.parse(raw) as Category[]) : []

    const category = categories.find((c) => String(c.id) === id)

    if (category) {
        return [200, category]
    } else {
        return [404, { message: 'Category not found' }]
    }
})

mock.onPut(new RegExp('^/api/category/\\d+$')).reply((config) => {
    const url = config.url || ''
    const id = url.split('/').pop()

    if (!id) {
        return [400, { message: 'Category ID is required' }]
    }

    const raw = localStorage.getItem(CATEGORIES_KEY)
    const categories = raw ? (JSON.parse(raw) as Category[]) : []

    const updatedCategory = JSON.parse(config.data)

    const index = categories.findIndex((c) => String(c.id) === id)

    if (index === -1) {
        return [404, { message: 'Category not found' }]
    }

    // Update the category at found index
    categories[index] = { ...categories[index], ...updatedCategory }

    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories))

    return [200, { message: 'Category updated successfully' }]
})
