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
}

export const TEMPLATE_LIST_KEY = 'template-list'
