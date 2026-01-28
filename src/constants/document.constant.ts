import { DocumentFormSchema } from '@/schemas/document.schema'

export const EMPTY_VALUES: DocumentFormSchema = {
    // Field from documentFieldOne
    mode: 'create', // 'create' | 'upload'
    category_id: '',
    department: [],
    number: '',
    name: '',
    status: 'controlled',

    header: {
        template_id: '',
        type: 'header',
        current_version: '',
    },
    footer: {
        template_id: '',
        type: 'footer',
        current_version: '',
    },
    copy_no: '',
    quantity_prepared: '',

    workflow_state: 'prepared',
    step_type: 'prepared',
    performed_date: new Date().toISOString(),
    effective_date: '',
    review_frequency: '',
    notification_unit: '',
    notification_value: '',
    editor_schema: null,
    schedule: {
        type: 'Daily',
        count: 1,
        interval: 1,
        cutOffTimes: ['00:00'],
        selectedItems: [],
        itemConfigs: {},
        selectedMonth: '',
        selectedDay: '',
    },
    form_fields: null,
    amendment_reason: '',
    amendment_type: '',
}

export const LIST_KEY = 'document-list'

export const STEP_ONE_FIELDS: (keyof DocumentFormSchema)[] = [
    'mode',
    'category_id',
    'department',
    'number',
    'name',
    'status',
    'header',
    'footer',
    'copy_no',
    'quantity_prepared',
    'workflow_state',
    'step_type',
    'performed_date',
    'effective_date',
    'review_frequency',
]

export const TABLESLIST = ['location', 'department', 'user']
export const TABLEWISELIST: Record<string, string[]> = {
    user: ['name', 'email', 'age'],
    location: ['name', 'identifier'],
    department: ['name', 'identifier'],
}

export const FREQUENCY_TYPE = [
    { value: 'Daily', label: 'Daily' },
    { value: 'Weekly', label: 'Weekly' },
    { value: 'Fortnightly', label: 'Fortnightly' },
    { value: 'Monthly', label: 'Monthly' },
    { value: 'Quarterly', label: 'Quarterly' },
    { value: 'Half-Yearly', label: 'Half-Yearly' },
    { value: 'Yearly', label: 'Yearly' },
]

export const DEFAULT_ITEM_CONFIG = {
    interval: 1,
    cutOffTimes: ['00:00'],
    considerLastDay: false,
}
