import { z } from 'zod'
import { validatePrefixRule } from '@/utils/validation/prefixConfigValidation'

export const categorySchema = z.object({
    name: z.string().min(1, 'Name is required'),
    identifier: z
        .string()
        .min(1, 'Prefix is required')
        .superRefine(async (value, ctx) => {
            const errors = await validatePrefixRule('categories', value)

            errors.forEach((message) =>
                ctx.addIssue({ code: 'custom', message }),
            )
        }),
})

export type CategoryFormSchema = z.infer<typeof categorySchema>
