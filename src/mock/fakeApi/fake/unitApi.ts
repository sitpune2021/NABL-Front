import { Unit } from '@/@types/unit'
import { UNIT_KEY } from '@/constants/api.constant'
import { mock } from '@/mock/MockAdapter'

// unit
mock.onGet(`/api/unit`).reply(() => {
    const raw = localStorage.getItem(UNIT_KEY)
    const Data = raw ? (JSON.parse(raw) as Unit[]) : []
    const response = {
        list: Data,
        total: Data.length,
    }

    return [200, response]
})

mock.onPost('/api/unit').reply((config) => {
    const raw = localStorage.getItem(UNIT_KEY)
    const existing = raw ? (JSON.parse(raw) as Unit[]) : []

    const unit = JSON.parse(config.data)

    let updated: Unit[]

    const index = existing.findIndex((c) => c.id === unit.id)

    if (index > -1) {
        // Update existing
        existing[index] = { ...existing[index], ...unit }
        updated = [...existing]
    } else {
        // Add new
        unit.id = unit.id || Date.now()
        updated = [...existing, unit]
    }

    localStorage.setItem(UNIT_KEY, JSON.stringify(updated))

    return [200, { message: 'Unit saved successfully' }]
})

mock.onGet(new RegExp('/api/unit/\\d+')).reply((config) => {
    const id = config.url?.split('/').pop()

    const raw = localStorage.getItem(UNIT_KEY)
    const units = raw ? (JSON.parse(raw) as Unit[]) : []

    const unit = units.find((d) => String(d.id) === id)

    if (unit) {
        return [200, unit]
    } else {
        return [404, { message: 'Unit not found' }]
    }
})

mock.onPut(new RegExp('^/api/unit/\\d+$')).reply((config) => {
    const url = config.url || ''
    const id = url.split('/').pop()

    if (!id) {
        return [400, { message: 'Unit ID is required' }]
    }

    const raw = localStorage.getItem(UNIT_KEY)
    const unit = raw ? (JSON.parse(raw) as Unit[]) : []

    const updatedUnit = JSON.parse(config.data)

    const index = unit.findIndex((c) => String(c.id) === id)

    if (index === -1) {
        return [404, { message: 'Unit not found' }]
    }

    // Update the unit at found index
    unit[index] = { ...unit[index], ...updatedUnit }

    localStorage.setItem(UNIT_KEY, JSON.stringify(unit))

    return [200, { message: 'Unit updated successfully' }]
})
