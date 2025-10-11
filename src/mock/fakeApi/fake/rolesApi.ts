import { Roles } from '@/@types/roles'
import { ROLES_KEY, USER_KEY } from '@/constants/api.constant'
import { mock } from '@/mock/MockAdapter'

// Roles
mock.onGet(`/api/roles`).reply(() => {
    const raw = localStorage.getItem(ROLES_KEY)
    const roleGroupsData = raw ? (JSON.parse(raw) as Roles[]) : []
    const userRaw = localStorage.getItem(USER_KEY)
    const users = userRaw ? (JSON.parse(userRaw) as []) : []
    const Data = roleGroupsData.map((group) => {
        const assignedUsers = users.filter((user) => user.role === group.name)
        return {
            ...group,
            users: assignedUsers,
        }
    })
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
    roles.users = [] // Set users to an empty array as intended
    roles.accessRight = {
        categories: ['write', 'read', 'delete'],
        departments: ['write', 'read', 'delete'],
        units: ['write', 'read', 'delete'],
        files: ['write', 'read', 'delete'],
        reports: ['write', 'read', 'delete'],
    }

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
    config.data.users = []
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
