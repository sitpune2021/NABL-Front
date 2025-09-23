import { mock } from '../MockAdapter'
import { TEMPLATES_KEY } from '@/constants/api.constant'

interface ComponentAttribute {
    id: string
}

interface Component {
    attributes: ComponentAttribute
}

interface JsonItem {
    type: string
    components: Component[]
}

interface Metadata {
    status: string
}

interface Template {
    id: string
    name: string
    type: string
    archived: boolean
    createdAt: string
    updatedAt: string
    css: string
    html: string
    json: JsonItem[]
    metadata: Metadata
}

mock.onGet(`/api/customers`).reply(() => {
    const raw = localStorage.getItem(TEMPLATES_KEY)
    const Data = raw ? (JSON.parse(raw) as Template[]) : []

    const response = {
        list: Data,
        total: Data.length,
    }

    return [200, response]
})
