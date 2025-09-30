import { Department } from '@/@types/department'
import { DEPARTMENTS_KEY } from '@/constants/api.constant'
import { mock } from '@/mock/MockAdapter'

// department
mock.onGet(`/api/department`).reply(() => {
    const raw = localStorage.getItem(DEPARTMENTS_KEY)
    const Data = raw ? (JSON.parse(raw) as Department[]) : []
    const response = {
        list: Data,
        total: Data.length,
    }

    return [200, response]
})

mock.onPost('/api/department').reply((config) => {
    const raw = localStorage.getItem(DEPARTMENTS_KEY)
    const existing = raw ? (JSON.parse(raw) as Department[]) : []

    const department = JSON.parse(config.data)

    let updated: Department[]

    const index = existing.findIndex((c) => c.id === department.id)

    if (index > -1) {
        // Update existing
        existing[index] = { ...existing[index], ...department }
        updated = [...existing]
    } else {
        // Add new
        department.id = department.id || Date.now()
        updated = [...existing, department]
    }

    localStorage.setItem(DEPARTMENTS_KEY, JSON.stringify(updated))

    return [200, { message: 'Department saved successfully' }]
})

mock.onGet(new RegExp('/api/department/\\d+')).reply((config) => {
    const id = config.url?.split('/').pop()

    const raw = localStorage.getItem(DEPARTMENTS_KEY)
    const departments = raw ? (JSON.parse(raw) as Department[]) : []

    const department = departments.find((d) => String(d.id) === id)

    if (department) {
        return [200, department]
    } else {
        return [404, { message: 'Department not found' }]
    }
})

mock.onPut(new RegExp('^/api/department/\\d+$')).reply((config) => {
    const url = config.url || ''
    const id = url.split('/').pop()

    if (!id) {
        return [400, { message: 'Department ID is required' }]
    }

    const raw = localStorage.getItem(DEPARTMENTS_KEY)
    const department = raw ? (JSON.parse(raw) as Department[]) : []

    const updatedDepartment = JSON.parse(config.data)

    const index = department.findIndex((c) => String(c.id) === id)

    if (index === -1) {
        return [404, { message: 'Department not found' }]
    }

    // Update the department at found index
    department[index] = { ...department[index], ...updatedDepartment }

    localStorage.setItem(DEPARTMENTS_KEY, JSON.stringify(department))

    return [200, { message: 'Department updated successfully' }]
})
