import { Template } from '@/@types/template'
import { TEMPLATE_KEY } from '@/constants/api.constant'
import { mock } from '@/mock/MockAdapter'

mock.onGet(`/api/template`).reply(() => {
    const raw = localStorage.getItem(TEMPLATE_KEY)
    const Data = raw ? (JSON.parse(raw) as Template[]) : []
    const response = {
        list: Data,
        total: Data.length,
    }

    return [200, response]
})

mock.onPost('/api/template').reply((config) => {
    const raw = localStorage.getItem(TEMPLATE_KEY)
    const existing = raw ? (JSON.parse(raw) as Template[]) : []

    const template = JSON.parse(config.data)

    let updated: Template[]

    const index = existing.findIndex((c) => c.id === template.id)

    if (index > -1) {
        // Update existing
        existing[index] = { ...existing[index], ...template }
        updated = [...existing]
    } else {
        // Add new
        template.id = template.id || Date.now()
        updated = [...existing, template]
    }

    localStorage.setItem(TEMPLATE_KEY, JSON.stringify(updated))

    return [200, { message: 'Template saved successfully' }]
})

mock.onGet(new RegExp('/api/template/\\d+')).reply((config) => {
    const id = config.url?.split('/').pop()

    const raw = localStorage.getItem(TEMPLATE_KEY)
    const templates = raw ? (JSON.parse(raw) as Template[]) : []

    const template = templates.find((d) => String(d.id) === id)

    if (template) {
        return [200, template]
    } else {
        return [404, { message: 'Template not found' }]
    }
})

mock.onPut(new RegExp('^/api/template/\\d+$')).reply((config) => {
    const url = config.url || ''
    const id = url.split('/').pop()

    if (!id) {
        return [400, { message: 'Template ID is required' }]
    }

    const raw = localStorage.getItem(TEMPLATE_KEY)
    const template = raw ? (JSON.parse(raw) as Template[]) : []

    const updatedTemplate = JSON.parse(config.data)

    const index = template.findIndex((c) => String(c.id) === id)

    if (index === -1) {
        return [404, { message: 'Template not found' }]
    }

    template[index] = { ...template[index], ...updatedTemplate }

    localStorage.setItem(TEMPLATE_KEY, JSON.stringify(template))

    return [200, { message: 'Template updated successfully' }]
})
