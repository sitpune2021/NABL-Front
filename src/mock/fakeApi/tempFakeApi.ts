import { Category } from '@/@types/category'
import { mock } from '../MockAdapter'
import {
    CATEGORIES_KEY,
    DEPARTMENTS_KEY,
    ROLES_KEY,
    UNIT_KEY,
} from '@/constants/api.constant'
import { Department } from '@/@types/department'
import { Unit } from '@/@types/unit'
import { Roles } from '@/@types/roles'

mock.onGet(`/api/category`).reply(() => {
    const raw = localStorage.getItem(CATEGORIES_KEY)
    const Data = raw ? (JSON.parse(raw) as Category[]) : []
    const response = {
        list: Data,
        total: Data.length,
    }

    return [200, response]
})

mock.onPost('/api/category').reply((config) => {
    const raw = localStorage.getItem(CATEGORIES_KEY)
    const existing = raw ? (JSON.parse(raw) as Category[]) : []

    const category = JSON.parse(config.data)

    let updated: Category[]

    const index = existing.findIndex((c) => c.id === category.id)

    if (index > -1) {
        // Update existing
        existing[index] = { ...existing[index], ...category }
        updated = [...existing]
    } else {
        // Add new
        category.id = category.id || Date.now()
        updated = [...existing, category]
    }

    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(updated))

    return [200, { message: 'Category saved successfully' }]
})

mock.onGet(new RegExp('/api/category/\\d+')).reply((config) => {
    const id = config.url?.split('/').pop()

    const raw = localStorage.getItem(CATEGORIES_KEY)
    const categories = raw ? (JSON.parse(raw) as Category[]) : []

    const category = categories.find((c) => String(c.id) === id)

    if (category) {
        return [200, category]
    } else {
        return [404, { message: 'Category not found' }]
    }
})

mock.onPut(new RegExp('^/api/category/\\d+$')).reply((config) => {
    const url = config.url || ''
    const id = url.split('/').pop()

    if (!id) {
        return [400, { message: 'Category ID is required' }]
    }

    const raw = localStorage.getItem(CATEGORIES_KEY)
    const categories = raw ? (JSON.parse(raw) as Category[]) : []

    const updatedCategory = JSON.parse(config.data)

    const index = categories.findIndex((c) => String(c.id) === id)

    if (index === -1) {
        return [404, { message: 'Category not found' }]
    }

    // Update the category at found index
    categories[index] = { ...categories[index], ...updatedCategory }

    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories))

    return [200, { message: 'Category updated successfully' }]
})

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

mock.onGet(`/api/roles`).reply(() => {
    const raw = localStorage.getItem(ROLES_KEY)
    const Data = raw ? (JSON.parse(raw) as Roles[]) : []
    const response = {
        list: Data,
        total: Data.length,
    }

    return [200, response]
})

mock.onPost('/api/roles').reply((config) => {
    const raw = localStorage.getItem(ROLES_KEY)
    const existing = raw ? (JSON.parse(raw) as Roles[]) : []

    const roles = JSON.parse(config.data)

    let updated: Roles[]

    const index = existing.findIndex((c) => c.id === roles.id)

    if (index > -1) {
        // Update existing
        existing[index] = { ...existing[index], ...roles }
        updated = [...existing]
    } else {
        // Add new
        roles.id = roles.id || Date.now()
        updated = [...existing, roles]
    }

    localStorage.setItem(ROLES_KEY, JSON.stringify(updated))

    return [200, { message: 'Roles saved successfully' }]
})

mock.onGet(new RegExp('/api/roles/\\d+')).reply((config) => {
    const id = config.url?.split('/').pop()

    const raw = localStorage.getItem(ROLES_KEY)
    const roless = raw ? (JSON.parse(raw) as Roles[]) : []

    const roles = roless.find((d) => String(d.id) === id)

    if (roles) {
        return [200, roles]
    } else {
        return [404, { message: 'Roles not found' }]
    }
})

mock.onPut(new RegExp('^/api/roles/\\d+$')).reply((config) => {
    const url = config.url || ''
    const id = url.split('/').pop()

    if (!id) {
        return [400, { message: 'Roles ID is required' }]
    }

    const raw = localStorage.getItem(ROLES_KEY)
    const roles = raw ? (JSON.parse(raw) as Roles[]) : []

    const updatedRoles = JSON.parse(config.data)

    const index = roles.findIndex((c) => String(c.id) === id)

    if (index === -1) {
        return [404, { message: 'Roles not found' }]
    }

    // Update the roles at found index
    roles[index] = { ...roles[index], ...updatedRoles }

    localStorage.setItem(ROLES_KEY, JSON.stringify(roles))

    return [200, { message: 'Roles updated successfully' }]
})
