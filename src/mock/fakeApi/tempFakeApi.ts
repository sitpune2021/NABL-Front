import { Category } from '@/@types/category'
import { mock } from '../MockAdapter'
import {
    CATEGORIES_KEY,
    DEPARTMENTS_KEY,
    ROLES_KEY,
    UNIT_KEY,
    SIGNATORYBY_KEY,
    SIGNATORYON_KEY,
    LAB_KEY,
    USER_KEY,
    TEMPLATE_KEY,
    SUBCATEGORIES_KEY,
    DOCUMENT_KEY,
} from '@/constants/api.constant'
import { Department } from '@/@types/department'
import { Unit } from '@/@types/unit'
import { SignatoryBy } from '@/@types/signatoryBy'
import { SignatoryOn } from '@/@types/signatoryOn'
import { Roles } from '@/@types/roles'
import { Lab } from '@/@types/lab'
import { User } from '@/@types/user'
import { Template } from '@/@types/template'
import { SubCategory } from '@/@types/subcategory'
import { Document } from '@/@types/document'

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

// unit
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

// Roles
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

mock.onGet(`/api/subcategory`).reply(() => {
    const raw = localStorage.getItem(SUBCATEGORIES_KEY)
    const Data = raw ? (JSON.parse(raw) as SubCategory[]) : []
    const response = {
        list: Data,
        total: Data.length,
    }

    return [200, response]
})

mock.onPost('/api/subcategory').reply((config) => {
    const raw = localStorage.getItem(SUBCATEGORIES_KEY)
    const existing = raw ? (JSON.parse(raw) as SubCategory[]) : []

    const subcategory = JSON.parse(config.data)

    let updated: SubCategory[]

    const index = existing.findIndex((c) => c.id === subcategory.id)

    if (index > -1) {
        // Update existing
        existing[index] = { ...existing[index], ...subcategory }
        updated = [...existing]
    } else {
        // Add new
        subcategory.id = subcategory.id || Date.now()
        updated = [...existing, subcategory]
    }

    localStorage.setItem(SUBCATEGORIES_KEY, JSON.stringify(updated))

    return [200, { message: 'SubCategory saved successfully' }]
})

mock.onGet(new RegExp('/api/subcategory/\\d+')).reply((config) => {
    const id = config.url?.split('/').pop()

    const raw = localStorage.getItem(SUBCATEGORIES_KEY)
    const subcategorys = raw ? (JSON.parse(raw) as SubCategory[]) : []

    const subcategory = subcategorys.find((d) => String(d.id) === id)

    if (subcategory) {
        return [200, subcategory]
    } else {
        return [404, { message: 'SubCategory not found' }]
    }
})

mock.onPut(new RegExp('^/api/subcategory/\\d+$')).reply((config) => {
    const url = config.url || ''
    const id = url.split('/').pop()

    if (!id) {
        return [400, { message: 'SubCategory ID is required' }]
    }

    const raw = localStorage.getItem(SUBCATEGORIES_KEY)
    const subcategory = raw ? (JSON.parse(raw) as SubCategory[]) : []

    const updatedSubCategory = JSON.parse(config.data)

    const index = subcategory.findIndex((c) => String(c.id) === id)

    if (index === -1) {
        return [404, { message: 'SubCategory not found' }]
    }

    // Update the subcategory at found index
    subcategory[index] = { ...subcategory[index], ...updatedSubCategory }

    localStorage.setItem(SUBCATEGORIES_KEY, JSON.stringify(subcategory))

    return [200, { message: 'SubCategory updated successfully' }]
})

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

// signatoryBy

mock.onGet(`/api/signatoryBy`).reply(() => {
    const raw = localStorage.getItem(SIGNATORYBY_KEY)
    const Data = raw ? (JSON.parse(raw) as SignatoryBy[]) : []
    const response = {
        list: Data,
        total: Data.length,
    }

    return [200, response]
})

mock.onPost('/api/signatoryBy').reply((config) => {
    const raw = localStorage.getItem(SIGNATORYBY_KEY)
    const existing = raw ? (JSON.parse(raw) as SignatoryBy[]) : []

    const signatoryBy = JSON.parse(config.data)

    let updated: SignatoryBy[]

    const index = existing.findIndex((c) => c.id === signatoryBy.id)

    if (index > -1) {
        // Update existing
        existing[index] = { ...existing[index], ...signatoryBy }
        updated = [...existing]
    } else {
        // Add new
        signatoryBy.id = signatoryBy.id || Date.now()
        updated = [...existing, signatoryBy]
    }

    localStorage.setItem(SIGNATORYBY_KEY, JSON.stringify(updated))

    return [200, { message: 'SignatoryBy saved successfully' }]
})

mock.onGet(new RegExp('/api/signatoryBy/\\d+')).reply((config) => {
    const id = config.url?.split('/').pop()

    const raw = localStorage.getItem(SIGNATORYBY_KEY)
    const signatoryBys = raw ? (JSON.parse(raw) as SignatoryBy[]) : []

    const signatoryBy = signatoryBys.find((d) => String(d.id) === id)

    if (signatoryBy) {
        return [200, signatoryBy]
    } else {
        return [404, { message: 'SignatoryBy not found' }]
    }
})

mock.onPut(new RegExp('^/api/signatoryBy/\\d+$')).reply((config) => {
    const url = config.url || ''
    const id = url.split('/').pop()

    if (!id) {
        return [400, { message: 'SignatoryBy ID is required' }]
    }

    const raw = localStorage.getItem(SIGNATORYBY_KEY)
    const signatoryBy = raw ? (JSON.parse(raw) as SignatoryBy[]) : []

    const updatedSignatoryBy = JSON.parse(config.data)

    const index = signatoryBy.findIndex((c) => String(c.id) === id)

    if (index === -1) {
        return [404, { message: 'SignatoryBy not found' }]
    }

    // Update the signatoryBy at found index
    signatoryBy[index] = { ...signatoryBy[index], ...updatedSignatoryBy }

    localStorage.setItem(SIGNATORYBY_KEY, JSON.stringify(signatoryBy))

    return [200, { message: 'SignatoryBy updated successfully' }]
})

// signatoryOn

mock.onGet(`/api/signatoryOn`).reply(() => {
    const raw = localStorage.getItem(SIGNATORYON_KEY)
    const Data = raw ? (JSON.parse(raw) as SignatoryOn[]) : []
    const response = {
        list: Data,
        total: Data.length,
    }

    return [200, response]
})

mock.onPost('/api/signatoryOn').reply((config) => {
    const raw = localStorage.getItem(SIGNATORYON_KEY)
    const existing = raw ? (JSON.parse(raw) as SignatoryOn[]) : []

    const signatoryOn = JSON.parse(config.data)

    let updated: SignatoryOn[]

    const index = existing.findIndex((c) => c.id === signatoryOn.id)

    if (index > -1) {
        // Update existing
        existing[index] = { ...existing[index], ...signatoryOn }
        updated = [...existing]
    } else {
        // Add new
        signatoryOn.id = signatoryOn.id || Date.now()
        updated = [...existing, signatoryOn]
    }

    localStorage.setItem(SIGNATORYON_KEY, JSON.stringify(updated))

    return [200, { message: 'SignatoryOn saved successfully' }]
})

mock.onGet(new RegExp('/api/signatoryOn/\\d+')).reply((config) => {
    const id = config.url?.split('/').pop()

    const raw = localStorage.getItem(SIGNATORYON_KEY)
    const signatoryOns = raw ? (JSON.parse(raw) as SignatoryOn[]) : []

    const signatoryOn = signatoryOns.find((d) => String(d.id) === id)

    if (signatoryOn) {
        return [200, signatoryOn]
    } else {
        return [404, { message: 'SignatoryOn not found' }]
    }
})

mock.onPut(new RegExp('^/api/signatoryOn/\\d+$')).reply((config) => {
    const url = config.url || ''
    const id = url.split('/').pop()

    if (!id) {
        return [400, { message: 'SignatoryOn ID is required' }]
    }

    const raw = localStorage.getItem(SIGNATORYON_KEY)
    const signatoryOn = raw ? (JSON.parse(raw) as SignatoryOn[]) : []

    const updatedSignatoryOn = JSON.parse(config.data)

    const index = signatoryOn.findIndex((c) => String(c.id) === id)

    if (index === -1) {
        return [404, { message: 'SignatoryOn not found' }]
    }

    // Update the signatoryOn at found index
    signatoryOn[index] = { ...signatoryOn[index], ...updatedSignatoryOn }

    localStorage.setItem(SIGNATORYON_KEY, JSON.stringify(signatoryOn))

    return [200, { message: 'SignatoryOn updated successfully' }]
})

// Lab mock APIs

mock.onGet(`/api/lab`).reply(() => {
    const raw = localStorage.getItem(LAB_KEY)
    const Data = raw ? (JSON.parse(raw) as Lab[]) : []
    const response = {
        list: Data,
        total: Data.length,
    }

    return [200, response]
})

mock.onPost('/api/lab').reply((config) => {
    const raw = localStorage.getItem(LAB_KEY)
    const existing = raw ? (JSON.parse(raw) as Lab[]) : []

    const lab = JSON.parse(config.data)

    let updated: Lab[]

    const index = existing.findIndex((c) => c.id === lab.id)

    if (index > -1) {
        // Update existing
        existing[index] = { ...existing[index], ...lab }
        updated = [...existing]
    } else {
        // Add new
        lab.id = lab.id || Date.now()
        updated = [...existing, lab]
    }

    localStorage.setItem(LAB_KEY, JSON.stringify(updated))

    return [200, { message: 'Lab saved successfully' }]
})

mock.onGet(new RegExp('/api/lab/\\d+')).reply((config) => {
    const id = config.url?.split('/').pop()

    const raw = localStorage.getItem(LAB_KEY)
    const labs = raw ? (JSON.parse(raw) as Lab[]) : []

    const lab = labs.find((d) => String(d.id) === id)

    if (lab) {
        return [200, lab]
    } else {
        return [404, { message: 'Lab not found' }]
    }
})

mock.onPut(new RegExp('^/api/lab/\\d+$')).reply((config) => {
    const url = config.url || ''
    const id = url.split('/').pop()

    if (!id) {
        return [400, { message: 'Lab ID is required' }]
    }

    const raw = localStorage.getItem(LAB_KEY)
    const lab = raw ? (JSON.parse(raw) as Lab[]) : []

    const updatedLab = JSON.parse(config.data)

    const index = lab.findIndex((c) => String(c.id) === id)

    if (index === -1) {
        return [404, { message: 'Lab not found' }]
    }

    // Update the lab at found index
    lab[index] = { ...lab[index], ...updatedLab }

    localStorage.setItem(LAB_KEY, JSON.stringify(lab))

    return [200, { message: 'Lab updated successfully' }]
})

// User mock APIs
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
