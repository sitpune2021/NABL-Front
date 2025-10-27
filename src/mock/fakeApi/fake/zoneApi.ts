import { Zone } from '@/@types/zone'
import { ZONE_KEY } from '@/constants/api.constant'
import { mock } from '@/mock/MockAdapter'

// zone
mock.onGet(`/api/zone`).reply(() => {
    const raw = localStorage.getItem(ZONE_KEY)
    const Data = raw ? (JSON.parse(raw) as Zone[]) : []
    const response = {
        list: Data,
        total: Data.length,
    }

    return [200, response]
})

mock.onPost('/api/zone').reply((config) => {
    const raw = localStorage.getItem(ZONE_KEY)
    const existing = raw ? (JSON.parse(raw) as Zone[]) : []

    const zone = JSON.parse(config.data)

    let updated: Zone[]

    const index = existing.findIndex((c) => c.id === zone.id)

    if (index > -1) {
        // Update existing
        existing[index] = { ...existing[index], ...zone }
        updated = [...existing]
    } else {
        // Add new
        zone.id = zone.id || Date.now()
        updated = [...existing, zone]
    }

    localStorage.setItem(ZONE_KEY, JSON.stringify(updated))

    return [200, { message: 'Zone saved successfully' }]
})

mock.onGet(new RegExp('/api/zone/\\d+')).reply((config) => {
    const id = config.url?.split('/').pop()

    const raw = localStorage.getItem(ZONE_KEY)
    const zones = raw ? (JSON.parse(raw) as Zone[]) : []

    const zone = zones.find((d) => String(d.id) === id)

    if (zone) {
        return [200, zone]
    } else {
        return [404, { message: 'Zone not found' }]
    }
})

mock.onPut(new RegExp('^/api/zone/\\d+$')).reply((config) => {
    const url = config.url || ''
    const id = url.split('/').pop()

    if (!id) {
        return [400, { message: 'Zone ID is required' }]
    }

    const raw = localStorage.getItem(ZONE_KEY)
    const zone = raw ? (JSON.parse(raw) as Zone[]) : []

    const updatedZone = JSON.parse(config.data)

    const index = zone.findIndex((c) => String(c.id) === id)

    if (index === -1) {
        return [404, { message: 'Zone not found' }]
    }

    // Update the zone at found index
    zone[index] = { ...zone[index], ...updatedZone }

    localStorage.setItem(ZONE_KEY, JSON.stringify(zone))

    return [200, { message: 'Zone updated successfully' }]
})
