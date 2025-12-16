import { DocumentFormSchema } from '@/@types/document'

export const defaultDocumentValues: DocumentFormSchema = {
    // Field from documentFieldOne
    mode: 'create', // 'create' | 'upload'
    category_id: '',
    department: [],
    number: '',
    name: '', // documentName
    status: 'controlled',

    // Field from documentFieldTwo
    header: {
        template_id: '',
        type: 'header',
        current_version: '',
    }, // object or undefined
    footer: {
        template_id: '',
        type: 'footer',
        current_version: '',
    }, // object or undefined
    copy_no: '',
    quantity_prepared: '',

    // Field from documentFieldThree
    workflow_state: 'prepared',
    step_type: 'prepared',
    performed_date: new Date().toISOString(),
    effective_date: '',
}
