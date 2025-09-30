import { User } from '@/@types/user'
import { USER_KEY } from '@/constants/api.constant'
import { mock } from '@/mock/MockAdapter'

mock.onGet(`/api/user`).reply(() => {
    const raw = localStorage.getItem(USER_KEY)
    const Data = raw ? (JSON.parse(raw) as User[]) : []
    const response = {
        list: Data,
        total: Data.length,
    }

    return [200, response]
})

mock.onPost('/api/user').reply((config) => {
    const raw = localStorage.getItem(USER_KEY)
    const existing = raw ? (JSON.parse(raw) as User[]) : []

    const user = JSON.parse(config.data)

    let updated: User[]

    const index = existing.findIndex((c) => c.id === user.id)

    if (index > -1) {
        // Update existing
        existing[index] = { ...existing[index], ...user }
        updated = [...existing]
    } else {
        // Add new
        user.id = user.id || Date.now()
        updated = [...existing, user]
    }

    localStorage.setItem(USER_KEY, JSON.stringify(updated))

    return [200, { message: 'User saved successfully' }]
})

mock.onGet(new RegExp('/api/user/\\d+')).reply((config) => {
    const id = config.url?.split('/').pop()

    const raw = localStorage.getItem(USER_KEY)
    const users = raw ? (JSON.parse(raw) as User[]) : []

    const user = users.find((d) => String(d.id) === id)

    if (user) {
        return [200, user]
    } else {
        return [404, { message: 'User not found' }]
    }
})

mock.onPut(new RegExp('^/api/user/\\d+$')).reply((config) => {
    const url = config.url || ''
    const id = url.split('/').pop()

    if (!id) {
        return [400, { message: 'User ID is required' }]
    }

    const raw = localStorage.getItem(USER_KEY)
    const user = raw ? (JSON.parse(raw) as User[]) : []

    const updatedUser = JSON.parse(config.data)

    const index = user.findIndex((c) => String(c.id) === id)

    if (index === -1) {
        return [404, { message: 'User not found' }]
    }

    // Update the user at found index
    user[index] = { ...user[index], ...updatedUser }

    localStorage.setItem(USER_KEY, JSON.stringify(user))

    return [200, { message: 'User updated successfully' }]
})
