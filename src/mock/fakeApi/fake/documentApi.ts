import { Document } from '@/@types/document'
import { DOCUMENT_KEY } from '@/constants/api.constant'
import { mock } from '@/mock/MockAdapter'

mock.onGet(`/api/document`).reply(() => {
    const raw = localStorage.getItem(DOCUMENT_KEY)
    const Data = raw ? (JSON.parse(raw) as Document[]) : []
    const response = {
        list: Data,
        total: Data.length,
    }

    return [200, response]
})

mock.onPost('/api/document').reply((config) => {
    const raw = localStorage.getItem(DOCUMENT_KEY)
    const existing = raw ? (JSON.parse(raw) as Document[]) : []

    const document = JSON.parse(config.data)

    let updated: Document[]

    const index = existing.findIndex((c) => c.id === document.id)

    if (index > -1) {
        // Update existing
        existing[index] = { ...existing[index], ...document }
        updated = [...existing]
    } else {
        // Add new
        document.id = document.id || Date.now()
        updated = [...existing, document]
    }

    localStorage.setItem(DOCUMENT_KEY, JSON.stringify(updated))

    return [200, { message: 'Document saved successfully' }]
})

mock.onGet(new RegExp('/api/document/\\d+')).reply((config) => {
    const id = config.url?.split('/').pop()

    const raw = localStorage.getItem(DOCUMENT_KEY)
    const documents = raw ? (JSON.parse(raw) as Document[]) : []

    const document = documents.find((d) => String(d.id) === id)

    if (document) {
        return [200, document]
    } else {
        return [404, { message: 'Document not found' }]
    }
})

mock.onPut(new RegExp('^/api/document/\\d+$')).reply((config) => {
    const url = config.url || ''
    const id = url.split('/').pop()

    if (!id) {
        return [400, { message: 'Document ID is required' }]
    }

    const raw = localStorage.getItem(DOCUMENT_KEY)
    const document = raw ? (JSON.parse(raw) as Document[]) : []

    const updatedDocument = JSON.parse(config.data)

    const index = document.findIndex((c) => String(c.id) === id)

    if (index === -1) {
        return [404, { message: 'Document not found' }]
    }

    // Update the document at found index
    document[index] = { ...document[index], ...updatedDocument }

    localStorage.setItem(DOCUMENT_KEY, JSON.stringify(document))

    return [200, { message: 'Document updated successfully' }]
})
