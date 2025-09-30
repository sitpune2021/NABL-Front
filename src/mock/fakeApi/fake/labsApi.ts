import { Lab } from '@/@types/lab'
import { LAB_KEY } from '@/constants/api.constant'
import { mock } from '@/mock/MockAdapter'

mock.onGet(`/api/lab`).reply(() => {
    const raw = localStorage.getItem(LAB_KEY)
    const Data = raw ? (JSON.parse(raw) as Lab[]) : []
    const response = {
        list: Data,
        total: Data.length,
    }

    return [200, response]
})

mock.onPost('/api/lab').reply((config) => {
    const raw = localStorage.getItem(LAB_KEY)
    const existing = raw ? (JSON.parse(raw) as Lab[]) : []

    const lab = JSON.parse(config.data)

    let updated: Lab[]

    const index = existing.findIndex((c) => c.id === lab.id)

    if (index > -1) {
        // Update existing
        existing[index] = { ...existing[index], ...lab }
        updated = [...existing]
    } else {
        // Add new
        lab.id = lab.id || Date.now()
        updated = [...existing, lab]
    }

    localStorage.setItem(LAB_KEY, JSON.stringify(updated))

    return [200, { message: 'Lab saved successfully' }]
})

mock.onGet(new RegExp('/api/lab/\\d+')).reply((config) => {
    const id = config.url?.split('/').pop()

    const raw = localStorage.getItem(LAB_KEY)
    const labs = raw ? (JSON.parse(raw) as Lab[]) : []

    const lab = labs.find((d) => String(d.id) === id)

    if (lab) {
        return [200, lab]
    } else {
        return [404, { message: 'Lab not found' }]
    }
})

mock.onPut(new RegExp('^/api/lab/\\d+$')).reply((config) => {
    const url = config.url || ''
    const id = url.split('/').pop()

    if (!id) {
        return [400, { message: 'Lab ID is required' }]
    }

    const raw = localStorage.getItem(LAB_KEY)
    const lab = raw ? (JSON.parse(raw) as Lab[]) : []

    const updatedLab = JSON.parse(config.data)

    const index = lab.findIndex((c) => String(c.id) === id)

    if (index === -1) {
        return [404, { message: 'Lab not found' }]
    }

    // Update the lab at found index
    lab[index] = { ...lab[index], ...updatedLab }

    localStorage.setItem(LAB_KEY, JSON.stringify(lab))

    return [200, { message: 'Lab updated successfully' }]
})
