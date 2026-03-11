import { TemplateFormSchema } from '@/schemas/template.schema'

export const EMPTY_VALUES: TemplateFormSchema = {
    name: '',
    type: '',
    template: {
        html: '',
        css: '',
        json: '',
    },
    status: 'draft',
    change_type: '',
    message: '',
    apply_all_documents: false,
}

export const TEMPLATE_LIST_KEY = 'template-list'
