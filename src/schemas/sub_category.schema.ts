import { z } from 'zod'
import { validatePrefixRule } from '@/utils/validation/prefixConfigValidation'

export const subCategorySchema = z.object({
    cat_id: z.union([
        z.number(),
        z.string().min(1, { message: 'category required' }),
    ]),
    name: z.string().min(1, { message: ' name required' }),
    identifier: z
        .string()
        .min(1, 'Prefix is required')
        .superRefine(async (value, ctx) => {
            const errors = await validatePrefixRule('sub_categories', value)

            errors.forEach((message) =>
                ctx.addIssue({ code: 'custom', message }),
            )
        }),
})

export type SubCategoryFormSchema = z.infer<typeof subCategorySchema>
