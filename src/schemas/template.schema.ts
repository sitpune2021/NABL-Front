import { z } from 'zod'
// import { validatePrefixRule } from '@/utils/validation/prefixConfigValidation'

export const templateSchema = z.object({
    name: z.string().min(1, { message: 'Name required' }),
    // .superRefine(async (value, ctx) => {
    //     const errors = await validatePrefixRule('templates', value)

    //     errors.forEach((message) =>
    //         ctx.addIssue({ code: 'custom', message }),
    //     )
    // }),
    type: z.string().min(1, { message: 'type required' }),
    template: z.any(),
    status: z.string(),
    change_type: z.string(),
    message: z.string(),
    apply_all_documents: z.boolean().optional(),
})

export type TemplateFormSchema = z.infer<typeof templateSchema>
