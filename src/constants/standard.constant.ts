import { StandardFormSchema } from '@/schemas/standard.schema'
import { nanoid } from 'nanoid'
import { v4 as uuidv4 } from 'uuid'

const EMPTY_STANDARD_ITEM = {
    id: null,
    parent_id: null,
    title: '',
    message: '',
    note: true,
    is_child: false,
    children_count: 0,
    children: [],
    numbering_value: '',
    numbering_type: 'none',
    depth: 0,
}

export const EMPTY_VALUES: StandardFormSchema = {
    uuid: uuidv4(),
    name: '',
    clauses: [EMPTY_STANDARD_ITEM],
}

export const LIST_KEY = 'sub-category-list'

export const createStandard = (depth: number) => ({
    id: nanoid(),
    parent_id: null,
    title: '',
    message: '',
    note: true,
    is_child: false,
    children_count: 0,
    children: [],
    numbering_value: '',
    numbering_type: 'none',
    depth,
})

export const numberingOptions = [
    { value: 'none', label: 'None' },
    { value: 'numerical', label: '1, 2, 3' },
    { value: 'alphabetical-lower', label: 'a, b, c' },
    { value: 'alphabetical-upper', label: 'A, B, C' },
    { value: 'roman-lower', label: 'i, ii, iii' },
    { value: 'roman-upper', label: 'I, II, III' },
    { value: 'dot', label: '• Bullet / Dot' },
]
