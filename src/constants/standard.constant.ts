import { StandardFormSchema } from '@/schemas/standard.schema'
import { nanoid } from 'nanoid'

const EMPTY_STANDARD_ITEM = {
    title: '',
    message: '',
    note: true,
    is_child: false,
    children_count: 0,
    children: [],
    numberingValue: '',
    numbering_type: 'none',
}

export const EMPTY_VALUES: StandardFormSchema = {
    uuid: '',
    name: '',
    clauses: [EMPTY_STANDARD_ITEM],
}

export const LIST_KEY = 'sub-category-list'

export const createStandard = (depth: number) => ({
    id: nanoid(),
    title: '',
    message: '',
    note: true,
    is_child: false,
    children_count: 0,
    children: [],
    numberingValue: '',
    numbering_type: 'none',
    depth,
})
