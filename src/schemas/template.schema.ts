import { z } from 'zod'

export const templateSchema = z.object({
    name: z.string().min(1, { message: 'Name required' }),
    type: z.string().min(1, { message: 'type required' }),
    template: z.any(),
    status: z.any().optional(),
    change_type: z.string().optional(),
    message: z.string().optional(),
})

export type TemplateFormSchema = z.infer<typeof templateSchema>
