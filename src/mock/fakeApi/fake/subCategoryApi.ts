import { SUBCATEGORIES_KEY } from '@/constants/api.constant'
import { SubCategory } from '@/@types/subcategory'
import { mock } from '@/mock/MockAdapter'

mock.onGet(`/api/subcategory`).reply(() => {
    const raw = localStorage.getItem(SUBCATEGORIES_KEY)
    const Data = raw ? (JSON.parse(raw) as SubCategory[]) : []
    const response = {
        list: Data,
        total: Data.length,
    }

    return [200, response]
})

mock.onPost('/api/subcategory').reply((config) => {
    const raw = localStorage.getItem(SUBCATEGORIES_KEY)
    const existing = raw ? (JSON.parse(raw) as SubCategory[]) : []

    const subcategory = JSON.parse(config.data)

    let updated: SubCategory[]

    const index = existing.findIndex((c) => c.id === subcategory.id)

    if (index > -1) {
        // Update existing
        existing[index] = { ...existing[index], ...subcategory }
        updated = [...existing]
    } else {
        // Add new
        subcategory.id = subcategory.id || Date.now()
        updated = [...existing, subcategory]
    }

    localStorage.setItem(SUBCATEGORIES_KEY, JSON.stringify(updated))

    return [200, { message: 'SubCategory saved successfully' }]
})

mock.onGet(new RegExp('/api/subcategory/\\d+')).reply((config) => {
    const id = config.url?.split('/').pop()

    const raw = localStorage.getItem(SUBCATEGORIES_KEY)
    const subcategorys = raw ? (JSON.parse(raw) as SubCategory[]) : []

    const subcategory = subcategorys.find((d) => String(d.id) === id)

    if (subcategory) {
        return [200, subcategory]
    } else {
        return [404, { message: 'SubCategory not found' }]
    }
})

mock.onPut(new RegExp('^/api/subcategory/\\d+$')).reply((config) => {
    const url = config.url || ''
    const id = url.split('/').pop()

    if (!id) {
        return [400, { message: 'SubCategory ID is required' }]
    }

    const raw = localStorage.getItem(SUBCATEGORIES_KEY)
    const subcategory = raw ? (JSON.parse(raw) as SubCategory[]) : []

    const updatedSubCategory = JSON.parse(config.data)

    const index = subcategory.findIndex((c) => String(c.id) === id)

    if (index === -1) {
        return [404, { message: 'SubCategory not found' }]
    }

    // Update the subcategory at found index
    subcategory[index] = { ...subcategory[index], ...updatedSubCategory }

    localStorage.setItem(SUBCATEGORIES_KEY, JSON.stringify(subcategory))

    return [200, { message: 'SubCategory updated successfully' }]
})
