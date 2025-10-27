import { Cluster } from '@/@types/cluster'
import { CLUSTER_KEY } from '@/constants/api.constant'
import { mock } from '@/mock/MockAdapter'

// cluster
mock.onGet(`/api/cluster`).reply(() => {
    const raw = localStorage.getItem(CLUSTER_KEY)
    const Data = raw ? (JSON.parse(raw) as Cluster[]) : []
    const response = {
        list: Data,
        total: Data.length,
    }

    return [200, response]
})

mock.onPost('/api/cluster').reply((config) => {
    const raw = localStorage.getItem(CLUSTER_KEY)
    const existing = raw ? (JSON.parse(raw) as Cluster[]) : []

    const cluster = JSON.parse(config.data)

    let updated: Cluster[]

    const index = existing.findIndex((c) => c.id === cluster.id)

    if (index > -1) {
        // Update existing
        existing[index] = { ...existing[index], ...cluster }
        updated = [...existing]
    } else {
        // Add new
        cluster.id = cluster.id || Date.now()
        updated = [...existing, cluster]
    }

    localStorage.setItem(CLUSTER_KEY, JSON.stringify(updated))

    return [200, { message: 'Cluster saved successfully' }]
})

mock.onGet(new RegExp('/api/cluster/\\d+')).reply((config) => {
    const id = config.url?.split('/').pop()

    const raw = localStorage.getItem(CLUSTER_KEY)
    const clusters = raw ? (JSON.parse(raw) as Cluster[]) : []

    const cluster = clusters.find((d) => String(d.id) === id)

    if (cluster) {
        return [200, cluster]
    } else {
        return [404, { message: 'Cluster not found' }]
    }
})

mock.onPut(new RegExp('^/api/cluster/\\d+$')).reply((config) => {
    const url = config.url || ''
    const id = url.split('/').pop()

    if (!id) {
        return [400, { message: 'Cluster ID is required' }]
    }

    const raw = localStorage.getItem(CLUSTER_KEY)
    const cluster = raw ? (JSON.parse(raw) as Cluster[]) : []

    const updatedCluster = JSON.parse(config.data)

    const index = cluster.findIndex((c) => String(c.id) === id)

    if (index === -1) {
        return [404, { message: 'Cluster not found' }]
    }

    // Update the cluster at found index
    cluster[index] = { ...cluster[index], ...updatedCluster }

    localStorage.setItem(CLUSTER_KEY, JSON.stringify(cluster))

    return [200, { message: 'Cluster updated successfully' }]
})
