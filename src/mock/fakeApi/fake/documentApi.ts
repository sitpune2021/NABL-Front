import { Document } from '@/@types/document'
import { DOCUMENT_KEY, DOCUMENT_KEY_EDITOR } from '@/constants/api.constant'
import { mock } from '@/mock/MockAdapter'

mock.onGet(`/api/document`).reply(() => {
    const raw = localStorage.getItem(DOCUMENT_KEY)
    const Data = raw ? (JSON.parse(raw) as Document[]) : []
    const response = {
        data: Data,
        total: Data.length,
    }

    return [200, response]
})

mock.onPost('/api/document').reply((config) => {
    const raw = localStorage.getItem(DOCUMENT_KEY)
    const existing = raw ? (JSON.parse(raw) as Document[]) : []

    const document = JSON.parse(config.data)

    let updated: Document[]
    let savedDocument: Document

    const index = existing.findIndex((c) => c.id === document.id)

    if (index > -1) {
        // Update existing
        existing[index] = { ...existing[index], ...document }
        updated = [...existing]
        savedDocument = existing[index]
    } else {
        // Add new
        document.id = document.id || Date.now()
        updated = [...existing, document]
        savedDocument = document
    }

    localStorage.setItem(DOCUMENT_KEY, JSON.stringify(updated))

    return [
        200,
        { message: 'Document saved successfully', data: savedDocument },
    ]
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
    const rawEditor = localStorage.getItem(DOCUMENT_KEY_EDITOR)
    const documentEditors = rawEditor ? JSON.parse(rawEditor) : []
    const documentEditor = documentEditors.find(
        (d) => String(d.documentId) === id,
    )

    return [
        200,
        { message: 'Document updated successfully', data: documentEditor },
    ]
})

mock.onPost('/api/document-editor').reply((config) => {
    const raw = localStorage.getItem(DOCUMENT_KEY_EDITOR)
    const existing = raw ? (JSON.parse(raw) as Document[]) : []

    const document = JSON.parse(config.data)

    let updated: Document[]
    let savedDocument: Document

    const index = existing.findIndex((c) => c.id === document.id)

    if (index > -1) {
        // Update existing
        existing[index] = { ...existing[index], ...document }
        updated = [...existing]
        savedDocument = existing[index]
    } else {
        // Add new
        document.id = document.id || Date.now()
        updated = [...existing, document]
        savedDocument = document
    }

    localStorage.setItem(DOCUMENT_KEY_EDITOR, JSON.stringify(updated))

    return [
        200,
        { message: 'Document saved successfully', data: savedDocument },
    ]
})

mock.onGet(new RegExp('/api/document-editor/\\d+')).reply((config) => {
    const id = config.url?.split('/').pop()

    const raw = localStorage.getItem(DOCUMENT_KEY_EDITOR)
    const documents = raw ? (JSON.parse(raw) as Document[]) : []

    const document = documents.find((d) => String(d.id) === id)

    if (document) {
        return [200, document]
    } else {
        return [404, { message: 'Document not found' }]
    }
})
