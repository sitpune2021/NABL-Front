import { Location } from '@/@types/location'
import { LOCATION_KEY } from '@/constants/api.constant'
import { mock } from '@/mock/MockAdapter'

// location
mock.onGet(`/api/location`).reply(() => {
    const raw = localStorage.getItem(LOCATION_KEY)
    const Data = raw ? (JSON.parse(raw) as Location[]) : []
    const response = {
        list: Data,
        total: Data.length,
    }

    return [200, response]
})

mock.onPost('/api/location').reply((config) => {
    const raw = localStorage.getItem(LOCATION_KEY)
    const existing = raw ? (JSON.parse(raw) as Location[]) : []

    const location = JSON.parse(config.data)

    let updated: Location[]

    const index = existing.findIndex((c) => c.id === location.id)

    if (index > -1) {
        // Update existing
        existing[index] = { ...existing[index], ...location }
        updated = [...existing]
    } else {
        // Add new
        location.id = location.id || Date.now()
        updated = [...existing, location]
    }

    localStorage.setItem(LOCATION_KEY, JSON.stringify(updated))

    return [200, { message: 'Location saved successfully' }]
})

mock.onGet(new RegExp('/api/location/\\d+')).reply((config) => {
    const id = config.url?.split('/').pop()

    const raw = localStorage.getItem(LOCATION_KEY)
    const locations = raw ? (JSON.parse(raw) as Location[]) : []

    const location = locations.find((d) => String(d.id) === id)

    if (location) {
        return [200, location]
    } else {
        return [404, { message: 'Location not found' }]
    }
})

mock.onPut(new RegExp('^/api/location/\\d+$')).reply((config) => {
    const url = config.url || ''
    const id = url.split('/').pop()

    if (!id) {
        return [400, { message: 'Location ID is required' }]
    }

    const raw = localStorage.getItem(LOCATION_KEY)
    const location = raw ? (JSON.parse(raw) as Location[]) : []

    const updatedLocation = JSON.parse(config.data)

    const index = location.findIndex((c) => String(c.id) === id)

    if (index === -1) {
        return [404, { message: 'Location not found' }]
    }

    // Update the location at found index
    location[index] = { ...location[index], ...updatedLocation }

    localStorage.setItem(LOCATION_KEY, JSON.stringify(location))

    return [200, { message: 'Location updated successfully' }]
})
