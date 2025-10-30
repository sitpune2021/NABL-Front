import { Instrument } from '@/@types/instrument'
import { INSTRUMENT_KEY } from '@/constants/api.constant'
import { mock } from '@/mock/MockAdapter'

mock.onGet(`/api/instrument`).reply(() => {
    const raw = localStorage.getItem(INSTRUMENT_KEY)
    const Data = raw ? (JSON.parse(raw) as Instrument[]) : []
    const response = {
        data: Data,
        total: Data.length,
    }

    return [200, response]
})

mock.onPost('/api/instrument').reply((config) => {
    const raw = localStorage.getItem(INSTRUMENT_KEY)
    const existing = raw ? (JSON.parse(raw) as Instrument[]) : []

    const instrument = JSON.parse(config.data)

    let updated: Instrument[]

    const index = existing.findIndex((c) => c.id === instrument.id)

    if (index > -1) {
        // Update existing
        existing[index] = { ...existing[index], ...instrument }
        updated = [...existing]
    } else {
        // Add new
        instrument.id = instrument.id || Date.now()
        updated = [...existing, instrument]
    }

    localStorage.setItem(INSTRUMENT_KEY, JSON.stringify(updated))

    return [200, { message: 'Instrument saved successfully' }]
})

mock.onGet(new RegExp('/api/instrument/\\d+')).reply((config) => {
    const id = config.url?.split('/').pop()

    const raw = localStorage.getItem(INSTRUMENT_KEY)
    const categories = raw ? (JSON.parse(raw) as Instrument[]) : []

    const instrument = categories.find((c) => String(c.id) === id)

    if (instrument) {
        return [200, instrument]
    } else {
        return [404, { message: 'Instrument not found' }]
    }
})

mock.onPut(new RegExp('^/api/instrument/\\d+$')).reply((config) => {
    const url = config.url || ''
    const id = url.split('/').pop()

    if (!id) {
        return [400, { message: 'Instrument ID is required' }]
    }

    const raw = localStorage.getItem(INSTRUMENT_KEY)
    const categories = raw ? (JSON.parse(raw) as Instrument[]) : []

    const updatedInstrument = JSON.parse(config.data)

    const index = categories.findIndex((c) => String(c.id) === id)

    if (index === -1) {
        return [404, { message: 'Instrument not found' }]
    }

    // Update the instrument at found index
    categories[index] = { ...categories[index], ...updatedInstrument }

    localStorage.setItem(INSTRUMENT_KEY, JSON.stringify(categories))

    return [200, { message: 'Instrument updated successfully' }]
})
